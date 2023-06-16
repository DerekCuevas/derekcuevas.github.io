---
title: "How to use Access Control in Go"
date: 2023-06-16T17:42:15.619Z
tags: ["golang","security","authorization"]
---


As an application grows, it can become increasingly important to enforce access control on specific resources or functionality. In simpler terms, it’s the process of determining whether a user is permitted to access certain actions or parts of an application. As we write Go apps, we'll often want to add some form of access control to our code. This can be done in many ways, but using an access control library is a common solution.

Today, we’ll discuss how to use the casbin access control library with Go and how to integrate it into a typical web application. We'll cover what casbin is, how to write access control policies, and how to enforce access control in a Go web application.

## What is Casbin?

Casbin is a powerful and flexible open-source access control library that provides familiar syntax for writing access control models and adapters for various storage systems (such as file systems, databases or key-value stores) that allow you to save and load the policies. It's unique due to its modularity, allowing you to easily switch between different access control models and policy storage systems.

It provides two types of access control: Role Based Access Control (RBAC) and Attribute Based Access Control (ABAC). In RBAC, permissions are assigned based on pre-defined roles, whereas in ABAC, permissions are assigned based on attributes, like user roles and custom properties.

Now that we understand the basics of what casbin is, we can start using it in our Go applications.

### Adding Casbin to a Go project

To add casbin to your Go project, run `go get github.com/casbin/casbin` in your terminal. Once installed, Casbin will have everything you need to add access control to your application.

### Writing Access Control Policies

Before we can enforce access control on our resources, we need to define what access control looks like. Casbin implements a policy that uses plain english to define access control policies. Here is an example of what an access control policy looks like:

```
p, alice, data1, read
p, bob, data2, write
g, alice, group1, admin
```

This policy defines the permissions for two resources: data1 and data2. Alice is allowed to read data1 and Bob is allowed to write to data2. Additionally, Alice is a member of group1, in which she has the admin role. 

You can write your policies as CSV files, which then must be loaded into the casbin engine. Casbin provides several methods to load policies, but in most cases, you will want to use the `NewEnforcer` method and pass in your policy path and model path.

### Enforcing Access Control

Now that we have our policies defined and loaded, we need to enforce these policies. Once again, we can accomplish this in several ways, but one of the most common approaches is to use middleware.

Let's build a sample web application with a protected route and show how to secure the route using casbin. We will use the popular web framework for Go, [Gin](https://github.com/gin-gonic/gin) for this example.

Here's our work-in-progress web application:

```
package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.GET("/admin", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello from admin!"})
	})

	router.Run(":8080")
}
```

To add access control, we'll first need to add the casbin middleware. Here's how to add the middleware using casbin's gin adapter:

```
package main

import (
	"github.com/gin-gonic/gin"
	"github.com/casbin/casbin"
	"github.com/casbin/casbin/util"
)

func main() {
	e := casbin.NewEnforcer("path/to/policy.csv", "path/to/model.conf")
	adapter := util.NewGinAdapter(router)

	router := gin.Default()

	router.Use(func(c *gin.Context) {
	    if !e.Enforce(c.Request.Header.Get("X-User"), c.Request.RequestURI, c.Request.Method) {
	        c.AbortWithStatus(403)
	    }

	    c.Next()
	})

	router.GET("/admin", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello from admin!"})
	})

	router.Run(":8080")
}
```

The middleware is written as a closure that takes a gin.Context as an argument. We are checking if the request is authorized using the `Enforce` function from casbin. The function checks against the Enforcer policy, which we had loaded earlier. If authorized, the middleware calls c.Next to continue processing the request. Otherwise, the middleware aborts the request with a 403 Unauthorized response.

And that's it! You now have the ability to control access to your protected routes based on policies in a CSV file. 

## Conclusion

Casbin is an easy-to-use, flexible, and scalable access control library for Go. It provides powerful features for enforcing access control by using roles, attributes and policies defined in plain English sentences. In this post, we covered how to add casbin to a Go web application, how to define access control policies and how to enforce policies using middleware. By implementing access control with casbin, you can add secure, fine-grained permission controls to your applications.