---
title: "Building a Scalable and Secure Authorization System with Keycloak"
date: 2023-06-17T18:02:56.303Z
tags: ["keycloak","authorization","security"]
---


Introduction:

When building a distributed system, securing your endpoints and authorizing access to your resources is a fundamental requirement. While there are many ways to design and implement an authorization system, doing it well, especially at scale, can be challenging.

In this article, we'll look at building a scalable and secure authorization system using Keycloak. Keycloak is an open-source Identity and Access Management solution that provides authentication, authorization, and single sign-on capabilities for your applications.

We'll start by introducing Keycloak and culminate with building an authorization system with multiple user roles using Keycloak's features.

Prerequisites:

- Basic understanding of authentication and authorization concepts.
- Familiarity with Java and Java-based web applications.
- Basic knowledge of OAuth 2.0 and OpenID Connect protocols.

What is Keycloak?

Keycloak is an open-source Identity and Access Management solution that allows applications to authenticate and authorize using various authentication protocols like OAuth 2.0, OpenID Connect, and SAML.

Some of the features provided by Keycloak are:

- Authentication of users and services using various authentication protocols.
- Authorization and access control of APIs and web applications.
- Single sign-on for multiple applications.
- Integration with external identity providers like Facebook and Google.
- Token management for authentication and authorization purposes.

Keycloak at a glance:

- Can be installed on-premises or in the cloud.
- Open-source software under Apache License 2.0
- Built on top of Wildfly.

Building an authorization system with Keycloak:

Now that we've introduced Keycloak, let's build an authorization system from scratch using Keycloak's features.

Our authorization system will manage access to a service for two roles: `managers` and `employees`. The managers will have full access to the service, while the employees will only be able to view the service data.

Here are the necessary steps to build this authorization system:

1. Install and run Keycloak:

We need to install Keycloak firstly. In order to do that, we'll use the Docker container. The Docker container provides an easy way to deploy and run Keycloak so you can start to use it immediately.

You can install Docker from the official page (https://www.docker.com/get-started).

Then, to install and run Keycloak, execute the following command:

```
$ docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin jboss/keycloak
```

This will start the Keycloak server on port 8080.

2. Create a realm:

A realm is a secure area in Keycloak that contains your client applications, user accounts, and authentication and authorization information.

To create a realm, sign in to Keycloak with the default credentials using your preferred web browser and click on the "Add realm" button. Give your realm a name and click on the "Create" button.

![Add realm button](https://raw.githubusercontent.com/derekcuevas/imgs/main/add-realm.png)

![Add realm dialog](https://raw.githubusercontent.com/derekcuevas/imgs/main/add-realm-dialog.png)

3. Create and add users to the realm:

To create users, click on the "Users" tab in your newly created realm dashboard, and then click the "Add user" button.

Fill in the required information for your user, and set a temporary password. You can remove the "Temporary" check so the user has to change its password at their first login. Finally, click the "Create" button.

![Add user button](https://raw.githubusercontent.com/derekcuevas/imgs/main/add-user.png)

![Add user dialog](https://raw.githubusercontent.com/derekcuevas/imgs/main/add-user-dialog.png)

4. Create roles:

To create roles, click on the "Roles" tab in your realm dashboard, and click on the "Add role" button.

Name the first role `manager` and the second one `employee`.

![Add role button](https://raw.githubusercontent.com/derekcuevas/imgs/main/add-role.png)

![Add role dialog](https://raw.githubusercontent.com/derekcuevas/imgs/main/add-role-dialog.png)

5. Assign roles to users:

To assign roles, click on the "Users" tab in your realm dashboard, select a user for which you want to assign roles, and click on the "Role mappings" tab.

In the "Available Roles" pane, select the `manager` role and transfer it to the "Assigned Roles" pane by clicking on the "Add selected" button. Do the same with the `employee` role.

![Role mapping tab](https://raw.githubusercontent.com/derekcuevas/imgs/main/role-mapping.png)

6. Create client and secure endpoints:

To create a client, ensure you are on the relevant realm dashboard and click on the "Clients" tab.

Create a new client and give your client a name and a client ID, e.g., `my-client`. Then, click on the "Save" button.

Now that the client has been created, we can create two endpoints, one for employees and one for managers, that will be secured by our authorization system.

To create the endpoints, click the "Configure" button beside the created client, go to the "Authorization" tab, and click on the "Resource Server" tab.

Create two resources, `employee-resource`, and `manager-resource`, and set them to be secret by clicking on the "Set secret" button.

![Resource server tab](https://raw.githubusercontent.com/derekcuevas/imgs/main/resource-server.png)

7. Configure authorization policies:

We've now created all the necessary pieces to configure our authorization policies.

Firstly, we need to configure authorization policies for our clients. To do this, go to the "Authorization" tab and the "Policies" tab. Create a scope named "employee-access" and another named "manager-access".

To configure the policies, select the `client` policy type and pick the `my-client` client that we've previously created. Assign the "employee-access" scope to the resource `employee-resource`, and the `manager-access` scope to the `manager-resource`.

![Policies tab](https://raw.githubusercontent.com/derekcuevas/imgs/main/policies.png)

8. Configure permissions:

To apply policies to users, we need to assign permissions to the previously defined roles.

To do this, click on the "Authorization" tab and select the second "Permissions" tab.

Assign the "manager-access" permission to the `manager` role. Assign the "employee-access" permission to the `employee` role.

![Permissions tab](https://raw.githubusercontent.com/derekcuevas/imgs/main/permissions.png)

9. Use tokens and test the authorization system:

After creating the authorization policies, we can test our authorization system by requiring access tokens for our previously defined secure endpoints.

To get an access token, we need to authenticate first. To authenticate, simply call the `/auth/realms/<realm-name>/protocol/openid-connect/token` endpoint with the client ID and user credentials.

For example, assuming both the user and client have already been created, you can get an access token by executing:

```
curl --location --request POST 'http://localhost:8080/auth/realms/myrealm/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=my-client' \
--data-urlencode 'username=user-name' \
--data-urlencode 'password=user-password' \
--data-urlencode 'grant_type=password'
```

This produces a JSON access token. We'll need to include this access token in a call to either `/employee-resource` or `/manager-resource`. 

Here's an example using `curl`:

```
curl --location --request GET 'http://localhost:8080/employee-resource' \
--header 'Authorization: Bearer <access-token>'
```

As expected, when making this call with the employee role, you should be authorized. However, when making the same call with the manager role, you'll receive a 403 Forbidden response because the manager role doesn't have access to the endpoint.

Conclusion:

In this article, we've demonstrated how to build a scalable and secure authorization system using Keycloak. We've covered creating realms, users, roles, clients, secure endpoints, authorization policies, and assigning permissions to roles.

By following the steps outlined above, we can implement an authorization system for our applications with a high degree of granularity and scalability.