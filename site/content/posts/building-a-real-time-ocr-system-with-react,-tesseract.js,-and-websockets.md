---
title: "Building a Real-Time OCR System with React, Tesseract.js, and WebSockets"
date: 2023-05-22T04:59:46.414Z
tags: ["react","ocr","websockets"]
---

Have you ever wanted to build a real-time Optical Character Recognition (OCR) system that can recognize text from incoming video or image streams? In this post, we'll explore how to build an OCR system using React, Tesseract.js, and WebSockets. 

## Introduction
Optical Character Recognition, also known as OCR, is the process of electronically extracting text from images or video. OCR is widely used in document processing, photo tagging, and captioning. A real-time OCR system can process incoming images or video streams and produce text that can be used in a variety of applications. In this post, we'll explore how to build a real-time OCR system that can recognize text from incoming video or image streams using React, Tesseract.js, and WebSockets.

## Prerequisites
Before we get started, make sure you have the following installed:

- Node.js (version 12 or higher)
- Git

## Getting Started
First, let's create a new React app using create-react-app.

```shell
npx create-react-app ocr-demo
cd ocr-demo
```

Next, we need to install some additional dependencies:

```shell
npm install react-webcam tesseract.js sockjs-client --save
```

We'll be using the "react-webcam" library to capture video frames, the "tesseract.js" library to perform OCR, and the "sockjs-client" library to send data over WebSockets.

## Creating a Webcam Component
We'll add a simple Webcam component that displays the video feed from the webcam. The Webcam component will allow us to capture frames and send them to the server for processing.

```jsx
import React, { useRef } from 'react';
import Webcam from "react-webcam";

const WebcamCapture = (props) => {
  const webcamRef = useRef(null);

  const capture = React.useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      props.onCapture(imageSrc);
    },
    [webcamRef, props.onCapture]
  );

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={capture}>Capture photo</button>
    </div>
  );
};

export default WebcamCapture;
```

The "onCapture" function will be called when the user clicks the "Capture photo" button, passing the captured image as an argument.

## Setting up the Server
We'll create an Express server that will handle incoming WebSocket connections. The server will listen for incoming frames, perform OCR using Tesseract.js, and send the text back to the client over WebSockets.

```javascript
const express = require('express');
const path = require('path');
const SockJS = require('sockjs');

const Tesseract = require('tesseract.js');

const server = express();

// Serve the static files
server.use(express.static(path.join(__dirname, 'build')));

// Set up a WebSocket server
const sockjs = require('sockjs');
const echo = sockjs.createServer();
echo.on('connection', function(conn) {
  console.log('Client connected');

  conn.on('data', async function(frame) {
    try {
      const image = new Image();
      image.src = frame;

      const { data: { text } } = await Tesseract.recognize(image);
      console.log(`Recognized text: ${text}`);

      conn.write(text);
    } catch (err) {
      console.error(err);
    }
  });

  conn.on('close', function() {
    console.log('Client disconnected');
  });
});
echo.installHandlers(server.listen(8081, '0.0.0.0', function() {
  console.log('WebSocket server listening on port 8081');
}));
```

## Creating the Client
Finally, we'll create a simple client that connects to the server using WebSockets, captures frames from the webcam, and sends them to the server for processing.

```jsx
import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import WebcamCapture from './WebcamCapture';

const SOCKET_SERVER_URL = 'http://localhost:8081';
const sock = new SockJS(SOCKET_SERVER_URL);

function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    sock.onmessage = function(e) {
      setText(e.data);
    };
  }, []);

  const handleCapture = (frame) => {
    sock.send(frame);
  };

  return (
    <div className="App">
      <WebcamCapture onCapture={handleCapture} />
      {text && (
        <div className="OCR-output">
          <h3>OCR Output:</h3>
          {text}
        </div>
      )}
    </div>
  );
}

export default App;
```

## Conclusion
In this post, we explored how to build a real-time OCR system using React, Tesseract.js, and WebSockets. We learned how to capture frames from a webcam, perform OCR on the frames using Tesseract.js, send the text back to the client over WebSockets, and display the text on the client.
