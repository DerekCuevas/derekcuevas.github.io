---
title: "How to Implement Optimistic Concurrency Control in Your Web Applications"
date: 2023-06-18T00:06:10.256Z
tags: ["web development","concurrency control"]
---


Overview
--------
As web applications become more complex and demand scalable and performant architectures, implementing concurrency control techniques becomes more critical. Optimistic concurrency control is a non-blocking approach to concurrency control that relies on assuming conflicts in writes are rare, which leads to better application performance. In this post, we'll explore how to implement optimistic concurrency control for your web applications.

Background on Optimistic Concurrency Control
---------------------------------------------
Optimistic concurrency control is a strategy for handling concurrent updates to a resource in a distributed system. The assumption in optimistic concurrency control is that write conflicts between concurrent requests are rare, and thus the locking mechanisms used with pessimistic concurrency control are not necessary. Instead, each request is granted access to the resource, and the resource checks if the version of the data being changed is consistent with the latest version in memory.

If the version is consistent, the request can go ahead and update the resource. If the version is inconsistent with the latest version in memory, the resource throws an error to the application layer that the data has changed since the client last read it and directs the application to try again.

Approaches to Implementing Optimistic Concurrency Control
---------------------------------------------------------
There are many different ways to implement optimistic concurrency control in a web application. Some common approaches include:

1. Version Control: In this approach, a version number is associated with each resource record. Each time a record is updated, the version number is incremented. When a client wants to update the record, it first retrieves the record and its version number. When it submits an update request, it includes the version number in the request, which the server validates against the current version number in memory. If the version number is up-to-date, the update goes ahead, and otherwise, the server returns an error.

Here's an example in JavaScript/Node.js:

```
const updateRecord = async (recordId, data, version) => {
  const result = await db.update({
    _id: recordId,
    version: version,
  }, {
    $set: data,
    $inc: { version: 1 },
  });
  if (result.modifiedCount !== 1) {
    throw new Error(`Update failed due to conflict with record ${recordId}`);
  }
};
```

2. Timestamps: In this approach, a timestamp is associated with each resource record. Each time a record is updated, the timestamp is updated. When a client wants to update the record, it first retrieves the record and its timestamp. When it submits an update request, it includes the timestamp in the request, which the server validates against the current timestamp in memory. If the timestamp is up-to-date, the update goes ahead, and otherwise, the server returns an error.

Here's an example in PHP:

```php
function updateRecord($recordId, $data, $timestamp) {
  $query = "
    UPDATE records
    SET data = :data, timestamp = NOW()
    WHERE id = :id AND timestamp = :timestamp
  ";
  $stmt = $db->prepare($query);
  $stmt->bindParam(':id', $recordId);
  $stmt->bindParam(':data', $data);
  $stmt->bindParam(':timestamp', $timestamp);
  $stmt->execute();
  if ($stmt->rowCount() !== 1) {
    throw new Exception("Update failed due to conflict with record $recordId");
  }
}
```

3. Optimistic Offline Caching: In this approach, the client-side cache for offline data is periodically synchronized with the server-side data. In addition, the server side logic is used to check if the selected client-record is in-sync with the server-record. If there is a conflict, the client is warned and can proceed with the update or choose to abort the operation.

Here's an example in React:

```javascript
async function onUpdate() {
  const recordFromLocalStorage = localStorage.getItem('record');
  const latestServerRecord = await fetch('/server/record');
  if (recordFromLocalStorage.version === latestServerRecord.version) {
    // Persist the changes to localStorage
    localStorage.setItem('record', updatedRecord);
    // Synchronize the changes to the server
    await fetch('/server/record', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRecord),
    });
  } else {
    alert('The record has been modified by another user. Please try again.')
  }
}
```
Conclusion
-----------
Implementing optimistic concurrency control in a distributed environment is crucial to prevent data corruption and improve application performance. This post covered three approaches to implementing optimistic concurrency control in web applications: version control, timestamps, and optimistic offline caching. Depending on your specific application requirements, you can choose the approach that works best for you.