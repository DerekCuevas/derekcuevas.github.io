---
title: "Writing Correct Web3 Smart Contracts with Solidity's Concerned Oxide (SCOCO) Conventions"
date: 2023-06-27T18:02:22.284Z
tags: ["blockchain","smart contracts","solidity"]
authors: ["gpt-3.5-turbo-0301"]
---



Smart contracts are self-executing contracts with the terms of the agreement directly written into code. These contracts are immutable and run on a distributed blockchain network. Writing smart contracts comes with the responsibility of ensuring the validity, security, and safety of the code.

Solidity is a high-level programming language used for writing smart contracts on Ethereum blockchain. It is an object-oriented, contract-oriented, and imperative language. The language has come a long way since its initial release, and the latest version, Solidity 0.8.x comes with various features that make it more secure, safe, and efficient.

One of the recent conventions proposed by the Solidity community is the Solidity's Concerned Oxide (SCOCO) conventions. The SCOCO conventions aim to promote secure and correct writing of smart contracts. In this article, we will discuss the SCOCO conventions and how we can use them to write better and secure smart contracts.

## What are the SCOCO Conventions?

The Solidity's Concerned Oxide (SCOCO) conventions are a set of best practices designed to help write secure, safe, and efficient smart contracts. The SCOCO conventions are built on top of the [Consensys Best Practices](https://consensys.github.io/smart-contract-best-practices/) and [Solidity Style Guide](https://solidity.readthedocs.io/en/v0.7.6/style-guide.html) and offer more guidance on how to write correct Solidity contracts.

The SCOCO conventions include guidelines on naming and formatting contracts, functions, and variables. It also gives guidelines on how to handle errors, use inheritance, and interact with external contracts. The primary goal of the SCOCO conventions is to reduce the risk of security vulnerabilities and bugs in smart contracts.

## Naming Conventions

The naming conventions are an essential part of the SCOCO guidelines. Following proper naming conventions makes code more understandable and readable, reducing the risk of errors and confusion.

### Contracts

Contract names should be written with CamelCase and should start with an upper-case letter. The name should be meaningful and describe the contract's functionality.

```solidity
contract VotingSystem {
  // ...
}
```

### Functions

Function names should be written with mixedCase and start with a lower-case letter. The name should be meaningful and describe the function's purpose.

```solidity
function vote(uint256 proposalID) public {
  // ...
}
```

### Variables

Variable names should be written with mixedCase and start with a lower-case letter. The name should be meaningful and describe the variable's purpose.

```solidity
address public owner;
```

### Constants

Constant names should be written in ALL_CAPS separated by underscores. The names should be meaningful and describe the constant's purpose.

```solidity
uint256 constant MAX_VOTES = 1_000_000;
```

## Formatting Conventions

The formatting conventions aim to make code cleaner and more consistent. Proper formatting can make code more readable and reduce the risk of bugs.

### Braces around Statements

All statements should be surrounded by braces, even if the block only contains a single statement. This formatting practice enhances readability and prevents bugs.

```solidity
function vote(uint256 proposalID) public {
  if (votes[msg.sender][proposalID] == true) {
    // ...
  }
}
```

### Avoid Long Lines

Lines should be kept relatively short, usually at around 80 characters, to enhance readability and make code more manageable.

```solidity
function getVotesCount(uint256 proposalID) public view returns (uint256) {
  uint256 totalVotesCount = voteCounts[proposalID];
  for (uint256 i = 0; i < voterCount; i++) {
    if (voters[i].hasVoted[proposalID] == true) {
      totalVotesCount += 1;
    }
  }
  return totalVotesCount;
}
```

## Error Handling Conventions

Explicit error handling is crucial for smart contracts. Proper error handling helps prevent unexpected behavior and security vulnerabilities.

### Using require() and revert()

The Solidity's Concerned Oxide conventions recommend the use of `require()` and `revert()` instead of `assert()`. `require()` and `revert()` are more efficient and result in lower gas cost.

```solidity
function vote(uint256 proposalID) public {
  require(hasVoted[msg.sender][proposalID] == false, "Already voted");
  hasVoted[msg.sender][proposalID] = true;
  voteCounts[proposalID] += 1;
}
```

### Providing Clear Error Messages

Error messages should be precise and meaningful. They should give developers insight into the cause of the error.

```solidity
function transfer(address recipient, uint256 amount) public {
  require(amount <= balanceOf[msg.sender], "Insufficient balance");
  balanceOf[msg.sender] -= amount;
  balanceOf[recipient] += amount;
  emit Transfer(msg.sender, recipient, amount);
}
```


## Conclusion

Solidity's Concerned Oxide (SCOCO) conventions provide a set of best practices that can help write more secure, efficient, and correct smart contracts. Following the SCOCO conventions can reduce the risk of security vulnerabilities and bugs in smart contracts. By following the conventions, developers can write better-quality code that is more readable, maintainable, and understandable. With the increasing popularity of blockchain and decentralized applications, writing secure smart contracts is more important than ever.