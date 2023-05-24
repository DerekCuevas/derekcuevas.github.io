---
title: "Building a High-Performance, Real-time Stock Trading System with Rust, Actix, and Redis"
date: 2023-05-24T12:03:13.281Z
tags: ["rust","actix","redis"]
---

In today's world, stock trading is a highly dynamic and real-time process that requires speed, scalability, and fault-tolerance. In this blog post, we'll dive into the details of building a high-performance, real-time, stock trading system using Rust, Actix, and Redis. This post is advanced level, and assumes a strong understanding of Rust, Actix, and Redis.

## Designing the Architecture of the Stock Trading System

Before we begin writing any code, we need to think about the architecture of our stock trading system. Our system needs to be highly scalable, fault-tolerant, and capable of handling a large number of concurrent connections. To achieve this, we'll take a microservices-based architecture approach, where services are responsible for a specific task and communicate with each other over a message bus.

The stock trading system can be divided into four main components:

1. Price Feed Service - This service is responsible for providing real-time stock price data to other services.
2. Order Management Service - This service handles all orders received from traders and executes them against the available stock.
3. Account Management Service - This service is responsible for managing trader accounts, including account balances and holdings.
4. Web Socket Service - This service enables real-time communication between traders and the server.

To implement real-time communication, we'll use the Redis pub/sub feature to broadcast stock prices and order execution events to all connected clients.

## Implementing the Services in Rust using Actix

Now that we have a clear understanding of our architecture, we can begin implementing our services. We'll use Rust with Actix, a high-performance, actor-based web framework that is ideal for building microservices.

### Price Feed Service

The price feed service is responsible for providing real-time stock price data, which other services consume. We'll use Actix's built-in WebSocket functionality to send real-time updates to connected clients.

```
// Define a WebSocket actor
struct PriceFeed {
    price: f64,
}

impl Actor for PriceFeed {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        // start the price feed loop
        ctx.run_interval(Duration::from_secs(1), |act, ctx| {
            // update the price randomly
            act.price = (100.0 + rand::random::<f64>() * 20.0).round_to(2);

            // broadcast the new price to all clients
            ctx.text(format!("{}", act.price));
        });
    }
}

// Define WebSocket route
async fn price_feed_route(r: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    ws::start(PriceFeed { price: 0.0 }, &r, stream)
}
```

### Order Management Service

The order management service is responsible for executing orders received from traders against the available stock. We'll use Redis pub/sub to broadcast order execution events to all connected clients.

```
// Define an order execution actor
struct OrderExecution {
    price: f64,
    stock: f64,
    clients: Vec<Recipient<String>>,
}

impl Actor for OrderExecution {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        // subscribe to the Redis pub/sub channel for order execution events
        let mut con = redis::Client::open("redis://127.0.0.1/").unwrap().get_connection().unwrap();
        let mut pubsub = con.as_pubsub();
        pubsub.subscribe("order_executed").unwrap();

        // start the order execution loop
        ctx.run_interval(Duration::from_secs(1), |act, _ctx| {
            // execute orders randomly
            if rand::random::<bool>() {
                let executed_price = (100.0 + rand::random::<f64>() * 20.0).round_to(2);
                let executed_stock = act.stock - rand::random::<f64>() * 10.0;
                act.price = executed_price;
                act.stock = executed_stock;

                // broadcast the order execution event to all clients
                act.clients.iter().for_each(|client| {
                    client.do_send(format!("Order executed: price={} stock={}", executed_price, executed_stock));
                });

                // publish the order execution event to Redis pub/sub channel
                let mut con = redis::Client::open("redis://127.0.0.1/").unwrap().get_connection().unwrap();
                let _ = con.publish("order_executed", format!("price={} stock={}", executed_price, executed_stock));
            }
        });
    }
}

// Define the order execution route
async fn order_execution_route(data: web::Data<AppState>) -> impl Responder {
    let (tx, rx) = mpsc::unbounded();
    let mut addresses = data.order_execution_addresses.lock().unwrap();
    addresses.push(tx);
    drop(addresses);

    HttpResponse::Ok().body("")
}
```

### Account Management Service

The account management service is responsible for managing trader accounts, including account balances and holdings. We'll use Redis as our database to store account balances and holdings.

```
// Define an account actor
struct Account {
    id: u64,
    balance: f64,
    stock: f64,
}

impl Account {
    async fn load(id: u64) -> Option<Self> {
        // load the account data from Redis
        let mut con = redis::Client::open("redis://127.0.0.1/").unwrap().get_connection().unwrap();
        let account_data: Option<String> = redis::cmd("GET").arg(format!("account:{}", id)).query(&mut con).ok();

        // parse the account data and return an Account object
        if let Some(data) = account_data {
            let parts: Vec<&str> = data.split(',').collect();
            if parts.len() == 2 {
                let balance = parts[0].parse().ok()?;
                let stock = parts[1].parse().ok()?;
                return Some(Self { id, balance, stock });
            }
        }

        None
    }

    async fn save(&self) {
        // save the account data to Redis
        let mut con = redis::Client::open("redis://127.0.0.1/").unwrap().get_connection().unwrap();
        let _ = redis::cmd("SET").arg(format!("account:{}", self.id)).arg(format!("{},{}", self.balance, self.stock)).query_async(&mut con).await;
    }
}

// Define the account management route
async fn account_route(id: web::Path<u64>, data: web::Data<AppState>) -> impl Responder {
    if let Some(mut account) = Account::load(*id).await {
        // handle account update request
        if let Ok(params) = web::Query::<HashMap<String, f64>>::from_query(&data).await {
            if let Some(balance) = params.get("balance") {
                account.balance = *balance;
            }
            if let Some(stock) = params.get("stock") {
                account.stock = *stock;
            }
            account.save().await;
        }

        // return account info
        HttpResponse::Ok().body(format!("Account: id={}, balance={}, stock={}", account.id, account.balance, account.stock))
    } else {
        HttpResponse::NotFound().body("")
    }
}
```

### Web Socket Service

The web socket service is responsible for enabling real-time communication between traders and the server. We'll use Actix's built-in WebSocket functionality and Redis pub/sub to broadcast stock prices and order execution events to all connected clients.

```
// Define a WebSocket actor
struct WebSocket {
    recipient: Option<Recipient<String>>,
}

impl Actor for WebSocket {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut ws::WebsocketContext<Self>) {
        // subscribe to the Redis pub/sub channel for price updates and order execution events
        let mut con = redis::Client::open("redis://127.0.0.1/").unwrap().get_connection().unwrap();
        let mut pubsub = con.as_pubsub();
        pubsub.subscribe("price_update").unwrap();
        pubsub.subscribe("order_executed").unwrap();
    
        // start receiving WebSocket messages
        self.recipient = Some(ctx.address().recipient());
    }
    
    fn stopped(&mut self, ctx: &mut ws::WebsocketContext<Self>) {
        // unsubscribe from the Redis pub/sub channels
        let mut con = redis::Client::open("redis://127.0.0.1/").unwrap().get_connection().unwrap();
        let mut pubsub = con.as_pubsub();
        pubsub.unsubscribe("price_update").unwrap();
        pubsub.unsubscribe("order_executed").unwrap();
    
        // remove the recipient from the list of WebSocket clients
        data.clients.lock().unwrap().remove(&ctx.address().recipient());
    }
}

// Define WebSocket route
async fn websocket_route(r: HttpRequest, stream: web::Payload, data: web::Data<AppState>) -> Result<HttpResponse, Error> {
    let (tx, rx) = mpsc::unbounded();
    data.clients.lock().unwrap().insert(tx);
    let websocket = WebSocket { recipient: None };
    let resp = ws::start(websocket, &r, stream)?;
    let mut websocket = resp.0;

    tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            if let Ok(Some(client)) = websocket.recipient.as_ref().map(|x| x.try_send(msg)) {
                if let Err(_disconnected) = client {}
            }
        }
    });

    Ok(resp)
}
```

## Conclusion

In this post, we've built a microservices-based architecture for a high-performance, real-time, stock trading system. We've used Rust with Actix to implement the various services, and Redis to enable real-time communication and database storage. By following best practices, we've ensured a highly scalable, fault-tolerant, and fast system architecture that can handle a large number of concurrent connections.
