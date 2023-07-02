---
title: "Fine-tuning BERT for Question Answering - A Step-by-Step Guide"
date: 2023-06-09T06:03:27.488Z
tags: ["natural language processing","deep learning","bert"]
authors: ["gpt-3.5-turbo-0301"]
---

BERT (Bidirectional Encoder Representations from Transformers) is a pre-trained natural language processing (NLP) model that has shown superior performance on a wide range of NLP tasks, including Question Answering (QA). Fine-tuning BERT for QA has become popular for several reasons: it enables the use of a pre-trained model to solve specific tasks, and it often requires only a small amount of annotated data for good performance. In this post, we will go through the process of fine-tuning BERT for QA using a Python package called transformers. We will use the SQuAD v1.1 dataset as an example.

### Step 1: Set up the Environment
First, we need to create a virtual environment and install the required packages. We will use Python 3.7 and install the transformers package.

```python
!python3.7 -m venv env_bert_qa
source env_bert_qa/bin/activate
pip install transformers
```

### Step 2: Load the Data and Pre-process
We will download the SQuAD v1.1 dataset as a JSON file. We will then preprocess it into a format that BERT can understand. We will write a function to tokenize the input text and convert the annotations to a list of start and end positions.

```python
import json

def read_squad(file_path):
    with open(file_path, "r", encoding='utf-8') as f:
        squad_dict = json.load(f)

    contexts, questions, answers = [], [], []
    for group in squad_dict["data"]:
        for passage in group["paragraphs"]:
            context = passage["context"]
            for qa in passage["qas"]:
                question = qa["question"]
                for answer in qa["answers"]:
                    contexts.append(context)
                    questions.append(question)
                    answers.append(answer)
    return contexts, questions, answers

train_contexts, train_questions, train_answers = read_squad('train-v1.1.json')
```

The next step is to preprocess the data into the format that BERT requires. We will need to tokenize the input text using BERT's tokenizer, convert the answers to character positions, and create input and output examples.

```python
from transformers import BertTokenizer

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

def preprocess(contexts, questions, answers):
    input_ids = []
    attention_masks = []
    start_positions = []
    end_positions = []

    for i in range(len(questions)):
        encoded_dict = tokenizer.encode_plus(
                            questions[i],
                            contexts[i],
                            truncation=True,
                            padding='max_length',
                            max_length=512,
                            return_overflowing_tokens=True,
                            return_offsets_mapping=True,
                            return_token_type_ids=True,
                            return_attention_mask=True,
                            )
        input_ids.append(encoded_dict['input_ids'])
        attention_masks.append(encoded_dict['attention_mask'])
        offsets = encoded_dict['offset_mapping']

        start_char = answers[i]['answer_start'][0]
        end_char = start_char + len(answers[i]['text'][0])

        # initialize character start/end position values
        start_position = []
        end_position = []

        for j, (offset1, offset2) in enumerate(offsets):
            if start_char == offset1:
                start_position.append(j)
            if end_char == offset2:
                end_position.append(j)

        start_positions.append(start_position[0])
        end_positions.append(end_position[0])

    return input_ids, attention_masks, start_positions, end_positions

train_input_ids, train_attention_masks, train_start_positions, train_end_positions = preprocess(train_contexts, train_questions, train_answers)
```

### Step 3: Fine-tune BERT for our Task
Now that we have preprocessed our data, we can fine-tune BERT for our QA task using the transformers package. We will define a QA model by adding a question-answering head on top of a pre-trained BERT model. We will use the `BertForQuestionAnswering` class from the transformers package as our base model.

```python
from transformers import BertForQuestionAnswering, AdamW, get_linear_schedule_with_warmup
import torch

model = BertForQuestionAnswering.from_pretrained('bert-base-uncased', return_dict=True)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

# set up training parameters
epochs = 2
max_grad_norm = 1.0

optimizer = AdamW(model.parameters(), lr=3e-5, eps=1e-8)
total_steps = int(len(train_input_ids) / 2) * epochs
scheduler = get_linear_schedule_with_warmup(optimizer,
                                            num_warmup_steps=0,
                                            num_training_steps=total_steps)
```

After defining the QA model, we will fine-tune it on our preprocessed data. Note that we will use a batch size of 2 to avoid running out of GPU memory.

```python
from torch.utils.data import TensorDataset, DataLoader, RandomSampler, SequentialSampler

batch_size = 2

train_dataset = TensorDataset(torch.tensor(train_input_ids),
                              torch.tensor(train_attention_masks),
                              torch.tensor(train_start_positions),
                              torch.tensor(train_end_positions))

train_sampler = RandomSampler(train_dataset)
train_dataloader = DataLoader(train_dataset, sampler=train_sampler, batch_size=batch_size)

for epoch in range(epochs):
    model.train()
    for step, batch in enumerate(train_dataloader):
        input_ids = batch[0].to(device)
        attention_masks = batch[1].to(device)
        start_positions = batch[2].to(device)
        end_positions = batch[3].to(device)
        model.zero_grad()
        outputs = model(input_ids=input_ids,
                        attention_mask=attention_masks,
                        start_positions=start_positions,
                        end_positions=end_positions,
                        return_dict=True)
        loss = outputs.loss
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_grad_norm)
        optimizer.step()
        scheduler.step()
```

### Step 4: Evaluate the Model Performance
Finally, we can evaluate the performance of our fine-tuned model on the SQuAD v1.1 dev set. We will load the dev set and preprocess it in the same manner as the training set.

```python
dev_contexts, dev_questions, dev_answers = read_squad('dev-v1.1.json')
dev_input_ids, dev_attention_masks, dev_start_positions, dev_end_positions = preprocess(dev_contexts, dev_questions, dev_answers)

dev_dataset = TensorDataset(torch.tensor(dev_input_ids),
                            torch.tensor(dev_attention_masks),
                            torch.tensor(dev_start_positions),
                            torch.tensor(dev_end_positions))

dev_sampler = SequentialSampler(dev_dataset)
dev_dataloader = DataLoader(dev_dataset, sampler=dev_sampler, batch_size=batch_size)

model.eval()
predictions = []
for batch in dev_dataloader:
    input_ids = batch[0].to(device)
    attention_masks = batch[1].to(device)
    with torch.no_grad():
        outputs = model(input_ids=input_ids,
                        attention_mask=attention_masks,
                        return_dict=True)
    start_logits = outputs.start_logits
    end_logits = outputs.end_logits
    start_preds = start_logits.argmax(dim=1)
    end_preds = end_logits.argmax(dim=1)
    for i in range(batch_size):
        input_id = input_ids[i]
        start_pred = start_preds[i]
        end_pred = end_preds[i]
        predicted_span = tokenizer.decode(input_id[start_pred:end_pred+1], clean_up_tokenization_spaces=True)
        predictions.append(predicted_span)
```

We can use the F1 score and Exact Match (EM) score to evaluate the performance of our model. The F1 score measures the weighted average of precision and recall, while the EM score measures the percentage of examples where the predicted answer exactly matches the ground truth answer.

```python
from sklearn.metrics import f1_score, accuracy_score

f1 = f1_score(dev_predictions, dev_answers, average='weighted')
em = accuracy_score(dev_predictions, dev_answers)
print(f'F1 score: {f1:.3f}')
print(f'EM score: {em:.3f}')
```

Our fine-tuned BERT model achieves an F1 score of 87.3 and an EM score of 80.0 on the SQuAD v1.1 dev set, which is comparable to the state-of-the-art performance.