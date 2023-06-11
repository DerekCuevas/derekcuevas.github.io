---
title: "How to Use AWS Fargate for Highly Scalable and Serverless Containers"
date: 2023-06-11T06:02:37.908Z
tags: ["aws","fargate","containers"]
---


Amazon Web Services has revolutionized the world of serverless computing with its suite of products designed to deliver cloud computing services that utilize a broad range of cloud-based applications. AWS Fargate from Amazon EC2 Container Service is a highly scalable and serverless compute engine designed to run containers. AWS Fargate allows you to design an elastic and scalable containerized application and infrastructure. In this post, we will discuss various aspects of AWS Fargate: what it is, what it is used for, how it works, and how you can use it to build highly scalable and serverless containers.

## What is AWS Fargate?

AWS Fargate is a compute engine for Amazon ECS that lets you run Docker containers without having to manage the underlying infrastructure. With AWS Fargate, you can focus on designing and configuring your container applications using the Docker CLI and APIs, and AWS Fargate will take care of all the heavy lifting such as scaling, patching, and upgrading the infrastructure. AWS Fargate is an alternative to Amazon Elastic Container Service (Amazon ECS) that lets you run Docker containers without having to manage the underlying infrastructure. Simply put, it is a way to run a container, without the need to configure any virtual machines or special-purpose host clusters.

## What is Amazon ECS?

Amazon Elastic Container Service (Amazon ECS) is a fully managed container management service that allows you to run Docker containers on the AWS Cloud. Amazon ECS eliminates the need for you to install and manage your own container orchestration infrastructure. Instead, Amazon ECS lets you manage your containerized applications in Amazon Web Services (AWS) and focus on delivering value to your end users. AWS Fargate is built on top of Amazon ECS, so you can leverage the full power of Amazon ECS while still enjoying the benefits of running your containers in a serverless fashion.

## How AWS Fargate works?

AWS Fargate runs Docker containers on virtual machines that are owned and managed by AWS. You create a task definition that describes your Docker containers and their configuration. The task definition specifies the Docker images to use, and the resources the containers need such as CPU and memory. AWS Fargate takes care of provisioning a virtual machine, installing the necessary software to run your containers, and launching your application.

AWS Fargate tasks run on an Amazon ECS cluster. An Amazon ECS cluster is a logical grouping of one or more Amazon EC2 instances that act as a pool of resources for running tasks. You can set up auto scaling in Amazon EC2 such that new Amazon EC2 instances are added to the ECS cluster as the demand for your containerized application grows.

When you run a Fargate task, you specify the CPU and memory requirements for each container, along with the Docker image URL. AWS Fargate runs the specified number of instances of containers, and automatically scales up or down as required. Once you have created a task definition, you can run multiple instances of that task on a single host or distribute it across multiple hosts as needed.

## How to use AWS Fargate in practice?

First, you need to choose the ECS compatible launch type as Fargate when creating a new task definition. Next, you can specify the container definition within that task definition, where you pass the Docker image and other configurations required by the task. After creating the task definition, you create a new AWS Fargate task by passing the task family and task definition, along with the resources required for the container your task contains.

Here is an example of a task definition:

```
{
  "family": "my-task",
  "containerDefinitions": [{
    "name": "my-container",
    "image": "nginx:alpine",
    "cpu": 256,
    "memory": 512,
    "essential": true,
    "portMappings": [{
      "containerPort": 80,
      "protocol": "tcp"
    }]
  }]
}
```

The task definition specifies that we want to launch the Nginx container image with 256 CPU units and 512 MB of memory, and map the host's port 80 to the container's port 80.

After setting up your task definition, it can be run with `run-task` command, passing the task definition to the task:

```
aws ecs run-task --cluster=my-cluster --task-definition=my-task
```

## Conclusion

AWS Fargate is a powerful and easy to use service that makes running containers on the AWS cloud much simpler. It takes care of many of the infrastructure concerns of running containers on AWS, such as scaling, patching, and upgrading, allowing you to focus on developing and deploying your container applications. With Fargate, you can use a single line of code to spin up a container without having to worry about the infrastructure that is running it.