---
title: "Building a High-Performance Real-Time Analytics Dashboard with Rust and PostgreSQL"
date: 2023-05-22T00:17:05.803Z
tags: ["rust","postgresql","real-time"]
---

Are you looking for a way to build a fast, real-time analytics dashboard? In this post, we'll explore how to build a dashboard using Rust and PostgreSQL. We'll start by looking at why Rust and PostgreSQL are such a great combination, and then we'll dive into how to use them together to build a high-performance real-time analytics dashboard.

## Why Rust and PostgreSQL?

Rust is a language that is known for its focus on performance and safety. It's a great choice for building high-performance systems that require low-level control. PostgreSQL is a powerful open-source database that is loved by developers for its scalability and reliability. Together, Rust and PostgreSQL can be used to build applications that are both fast and safe.

## Setting up the Project

Before we get started building our dashboard, we need to set up our project. We'll be using Rust's Actix web framework and the Postgres crate to communicate with our PostgreSQL database. Let's start by creating a new Rust project and adding these dependencies to our `Cargo.toml` file:

```toml
[dependencies]
actix-web = "3.3.2"
tokio = { version = "1.13", features = ["full"] }
postgres = "0.22.1"
chrono = "0.4.19"
serde = { version = "1.0", features = ["derive"] }
```

Our dependencies include the Actix web framework, the Postgres crate, and some additional libraries we'll use later on.

Next, let's create a new PostgreSQL database and table to store our data. We'll be storing user metrics, so let's create a table to store that information:

```sql
CREATE TABLE user_metrics (
    id serial PRIMARY KEY,
    user_id INTEGER NOT NULL,
    page_views INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

With our database and table set up, we can start building our dashboard.

## Building the Dashboard

Our dashboard will have two main components: a backend that will receive data from clients and store it in our PostgreSQL database, and a frontend that will display real-time analytics for our users. Let's start by building our backend.

### Backend

We'll start by setting up our Actix web server. Here's the code to get us started:

```rust
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use chrono::{DateTime, Utc};
use tokio::sync::mpsc::{channel, Receiver, Sender};
use std::sync::{Arc, Mutex};
use tokio::time::{sleep, Duration};
use futures::StreamExt;

async fn index() -> impl Responder {
    HttpResponse::Ok().body("Hello, world!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(index)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
```

This sets up a basic Actix web server that responds to requests with "Hello, world!".

Next, let's add a route to accept incoming metrics data:

```rust
#[post("/metrics")]
async fn metrics(data: web::Json<MetricData>) -> impl Responder {
    // TODO: store data in PostgreSQL
    HttpResponse::Ok()
}
```

This route will accept metrics data from clients and store it in our PostgreSQL database.

Before we store the data in our database, let's aggregate the data into 10 second intervals. We'll also use a channel to update our frontend with the latest real-time data. Here's the code to set up our channels:

```rust
struct Aggregator {
    interval: Duration,
    sender: Sender<String>,
}

impl Aggregator {
    fn new(interval: Duration, sender: Sender<String>) -> Self {
        Aggregator {
            interval,
            sender,
        }
    }

    async fn run(&self, receiver: &Arc<Mutex<Receiver<MetricData>>>) {
        loop {
            sleep(self.interval).await;
            let start = Utc::now();
            let duration = chrono::Duration::seconds(self.interval.as_secs() as i64);
            let end = start + duration;
            
            let mut page_views = 0;
            let mut duration_total = 0;
            
            let mut receiver = receiver.lock().unwrap();

            while let Some(data) = receiver.recv().await {
                page_views += data.page_views;
                duration_total += data.duration;
            }

            let avg_duration = duration_total / page_views;
            let result = format!("{{ \"page_views\": {}, \"avg_duration\": {} }}", page_views, avg_duration);
            
            if let Err(e) = self.sender.send(result).await {
                println!("Error sending real-time data to frontend: {}", e);
            }
        }
    }
}
```

This code sets up a new Aggregator struct that will group our data into 10 second intervals and send real-time data to our frontend using the channel we set up earlier.

Finally, let's modify our `metrics` route to store the data in our PostgreSQL database and send it to our Aggregator:

```rust
#[post("/metrics")]
async fn metrics(
    data: web::Json<MetricData>,
    db: web::Data<Pool>,
    aggregator: web::Data<Arc<Aggregator>>,
) -> impl Responder {
    let pool = db.get_ref();
    let result = pool
        .query(
            "INSERT INTO user_metrics (user_id, page_views, duration, created_at) VALUES ($1, $2, $3, $4)",
            &[&data.user_id, &data.page_views, &data.duration, &Utc::now()],
        )
        .await
        .map_err(|e| HttpResponse::InternalServerError().body(format!("Failed to store metrics: {:?}", e)))?;

    if let Err(e) = aggregator.sender.clone().send(result.to_string()).await {
        println!("Error sending real-time data to aggregator: {}", e);
    }
    HttpResponse::Ok()
}
```

This code uses the Postgres crate to store our data in our PostgreSQL database and uses our Aggregator to group our data into 10 second intervals and send real-time data to our frontend.

### Frontend

Now that our backend is set up to receive and aggregate our metrics data, we can start building our frontend. We'll be using React and Chart.js to display our real-time analytics.

Here's some basic code to get our React app set up:

```jsx
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js';

const Dashboard = () => {
  const [realtimeData, setRealtimeData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws');

    ws.onmessage = function (event) {
      const parsedData = JSON.parse(event.data);
      setRealtimeData(data => [...data, parsedData]);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const ctx = document.getElementById('chart');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: realtimeData.map(data => new Date(data.time).toLocaleTimeString()),
        datasets: [
          {
            label: 'Page views',
            data: realtimeData.map(data => data.page_views),
            borderColor: 'rgba(0, 0, 255, 1)',
            tension: 0.1,
          },
          {
            label: 'Average duration',
            data: realtimeData.map(data => data.avg_duration),
            borderColor: 'rgba(255, 0, 0, 1)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 20
              }
            }
          ]
        }
      },
    });
  }, [realtimeData]);

  return (
    <div>
      <canvas id="chart" />
    </div>
  );
};
```

This code sets up a new WebSocket connection to our server and uses Chart.js to display our real-time data in a line graph.

## Conclusion

And there you have it! We've explored how to build a real-time analytics dashboard using Rust and PostgreSQL. By combining Rust's focus on performance and safety with PostgreSQL's scalability and reliability, we've built an application that's both fast and safe.

If you have any questions or suggestions, feel free to leave a comment below!
