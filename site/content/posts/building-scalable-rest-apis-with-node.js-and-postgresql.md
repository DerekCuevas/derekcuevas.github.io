---
title: "Building Scalable REST APIs with Node.js and PostgreSQL"
date: 2023-05-31T18:02:53.154Z
tags: ["node.js","postgresql","rest apis"]
---


Node.js is an extremely popular platform for building REST APIs. Its non-blocking I/O model and asynchronous event-driven architecture make it ideal for developing high-performing, scalable network applications. In this post, we'll take a deep dive into building scalable REST APIs with Node.js and PostgreSQL.

## Prerequisites

Before we begin, you'll need to have the following installed:

- Node.js (version 12 or later)
- PostgreSQL (version 10 or later)

You should also have a basic understanding of Node.js and how to use it to build REST APIs.

## Setting up the Project

Let's start by creating a new Node.js project and installing the necessary dependencies:

```bash
# Create a new folder for the project
mkdir scalable-rest-apis
cd scalable-rest-apis

# Initialize a new Node.js project
npm init

# Install the necessary dependencies
npm install express pg
```

We're using `express` as our web framework and `pg` as our PostgreSQL database driver.

Now that we have our project set up, let's create a new file called `index.js` and add the following code:

```javascript
const express = require('express');
const { Pool } = require('pg');

// Initialize express app and database connection pool
const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432,
});

// Define routes
app.get('/users', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users');
  res.json(rows);
});

// Start the server
app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});
```

This code initializes an express app and a database connection pool with the appropriate configuration options. We then define a single route for getting all users from the database.

## Creating the Database

Next, we need to create our PostgreSQL database and add a `users` table. Run the following SQL commands in a PostgreSQL client:

```sql
CREATE DATABASE mydb;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT
);
```

This creates a new database called `mydb` and a `users` table with an `id` column and a `name` column.

## Writing Routes

We now have the basic infrastructure set up for our REST API. Let's add some more routes for creating, updating, and deleting users.

```javascript
// Create a user
app.post('/users', async (req, res) => {
  const { name } = req.body;
  const { rows } = await pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [name]);
  res.json(rows[0]);
});

// Update a user
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { rows } = await pool.query('UPDATE users SET name = $1 WHERE id = $2 RETURNING *', [name, id]);

  if (rows.length === 0) {
    res.status(404).send('User not found');
  } else {
    res.json(rows[0]);
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

  if (rows.length === 0) {
    res.status(404).send('User not found');
  } else {
    res.sendStatus(204);
  }
});
```

These routes allow us to create, update, and delete users in the database using the HTTP POST, PUT, and DELETE methods, respectively.

## Adding Input Validation

Our REST API now has routes for creating, updating, and deleting users, but we still need to add input validation to ensure that the requests contain valid data. Let's use the popular `joi` library for this purpose. First, install the `joi` library:

```bash
npm install joi
```

Then, add input validation to our `POST` and `PUT` routes:

```javascript
const Joi = require('joi');

// Create a user
app.post('/users', async (req, res) => {
  const { error } = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  }).validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const { name } = req.body;
  const { rows } = await pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [name]);
  res.json(rows[0]);
});

// Update a user
app.put('/users/:id', async (req, res) => {
  const { error } = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  }).validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const { id } = req.params;
  const { name } = req.body;
  const { rows } = await pool.query('UPDATE users SET name = $1 WHERE id = $2 RETURNING *', [name, id]);

  if (rows.length === 0) {
    res.status(404).send('User not found');
  } else {
    res.json(rows[0]);
  }
});
```

We added a validation schema using the `Joi.object()` method, which specifies that the `name` field is required and must be between 3 and 30 characters long. We then validate the request body using this schema and send a `400 Bad Request` response if the validation fails.

## Conclusion

In this post, we've covered how to build scalable REST APIs with Node.js and PostgreSQL. We created a basic infrastructure for our REST API, with support for creating, updating, and deleting users. We then added input validation using the `joi` library. You should now be able to apply these concepts to build your own scalable REST APIs.