---
title: "Building a High-Performance and Cost-Effective Video Streaming Platform with Rust and AWS Elemental MediaStore"
date: 2023-05-28T06:02:47.821Z
tags: ["rust","aws elemental mediastore","video streaming"]
authors: ["gpt-3.5-turbo-0301"]
---


Video streaming is on the rise, and with it, comes new performance and latency challenges. Building a high-performance and cost-effective video streaming platform can be a daunting task, but with the right tools, it's achievable.

In this post, we'll showcase how to build a high-performance and cost-effective video streaming platform using Rust and AWS Elemental MediaStore. AWS Elemental MediaStore is a highly scalable and durable storage service that is optimized for mission-critical media use cases, including video streaming.

## Prerequisites

Before we begin our journey, we need to have the following prerequisites in place:

- An AWS account
- AWS CLI installed and configured
- Rust environment setup
- Cargo AWS CLI installed

## Getting Started

Firstly, we need to create an AWS Elemental MediaStore container that will be used to store our video files. We can run the following command:

```
aws mediastore-data create-container --container-name <container-name>
```

Next, we need to create an endpoint that will allow us to access our AWS Elemental MediaStore container. We can do this by running the following command:

```
aws mediastore describe-container --container-name <container-name> --query "Container.Endpoint" --output text
```

We can now proceed to generate our video content. This can be done using any appropriate video recording or rendering software.

## Uploading Video Content

Once we have our video content, we need to upload it to our AWS Elemental MediaStore container. We'll use the Rust `rusoto_medistor` crate to upload the content. Add the following dependency to your `Cargo.toml` file:

```
[dependencies]
rusoto_core = "0.44.0"
rusoto_media_store_data = "0.44.0"
```

Then, we can use the following Rust code snippet to upload our video content:

```rust
use rusoto_core::Region;
use rusoto_media_store_data::{MediaStoreData, MediaStoreDataClient, PutObjectRequest, PutObjectResponse};

let region = Region::UsEast1;
let client = MediaStoreDataClient::new(region);

let object_data = vec![1, 2, 3];

let put_request = PutObjectRequest {
    body: Some(object_data.into()),
    content_length: Some(3),
    content_type: Some("(binary/octet-stream)".to_owned()),
    path: "path/to/object.mp4".to_owned(),
    ..Default::default()
};

let result: PutObjectResponse = client.put_object(put_request).await?;
```

## Serving Video Content

Finally, we can serve our video content to our viewers. We'll use the Rust crate `iron` for this purpose. Add the following dependency to your `Cargo.toml` file:

```
[dependencies]
iron = "0.6"
```

Then, we can use the following Rust code snippet to serve our video content:

```rust
use iron::{headers, status, Iron, Request, Response, IronResult};
use iron::mime::Mime;
use rusoto_core::Region;
use rusoto_media_store_data::{MediaStoreData, MediaStoreDataClient, GetObjectRequest};

let region = Region::UsEast1;
let client = MediaStoreDataClient::new(region);

fn main() {
    let port = 8080; // Customize the port as per requirement

    Iron::new(|req: &mut Request| -> IronResult<Response> {
        let get_request = GetObjectRequest {
            path: "/path/to/object.mp4".to_owned(),
            ..Default::default()
        };
        let result = client.get_object(get_request).await?;
        let contents = result.body.unwrap().into_blocking_read();
        let len = contents.len() as u64;

        let content_type = "video/mp4".parse::<Mime>().unwrap();
        let range: Option<&str> = req.headers
            .get_raw("range")
            .and_then(|r| r.to_str().ok());

        if let Some(range_value) = range {
            let mut parts = range_value.replace("bytes=", "")
                .split('-')
                .map(|x| x.parse::<u64>().ok());
            let start = parts.next().flatten().unwrap_or(0);
            let end = parts.next().flatten().unwrap_or(len - 1);
            Ok(Response::with((
                status::PartialContent,
                contents.limit(end - start + 1).read_to_end()?,
                headers::ContentLength(end - start + 1),
                headers::ContentType(content_type),
                headers::ContentRange((start..=end).to_string()),
                headers::AcceptRanges("bytes".to_owned()),
            )))
        } else {
            Ok(Response::with((
                status::Ok,
                contents.read_to_end()?,
                headers::ContentLength(len),
                headers::ContentType(content_type),
                headers::AcceptRanges("bytes".to_owned()),
            )))
        }
    }).http(format!("0.0.0.0:{}", port)).unwrap();

    println!("Streaming server started at http://{host}:{port}", host = "0.0.0.0", port = port);
}
```

### Conclusion

In this post, we've seen how to build a high-performance and cost-effective video streaming platform using Rust and AWS Elemental MediaStore. By leveraging these technologies, we can build scalable and durable video streaming platforms that meet or exceed our business and technical requirements.