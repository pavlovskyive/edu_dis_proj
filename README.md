
# InSysRestAPI

Project management system REST API for 'Information systems' class of Kyiv Polytechnic Institute.

<!--- If we have only one group/collection, then no need for the "ungrouped" heading -->


## Variables

| Key | Value | Type |
| --- | ------|-------------|
| host_url | https://powerful-bayou-25482.herokuapp.com | string |



## Endpoints

* [Auth](#auth)
    1. [Register](#1-register)
        * [Register](#i-example-request-register)
    1. [Login](#2-login)
        * [Login](#i-example-request-login)
* [Cards](#cards)
    1. [Get all cards](#1-get-all-cards)
        * [Get all cards](#i-example-request-get-all-cards)
    1. [Get card](#2-get-card)
        * [Get card](#i-example-request-get-card)
    1. [Create card](#3-create-card)
        * [Create card](#i-example-request-create-card)
    1. [Update card](#4-update-card)
        * [Update card](#i-example-request-update-card)
    1. [Delete card](#5-delete-card)
        * [Delete card](#i-example-request-delete-card)

--------



## Auth

Authentication API



### 1. Register


Register user in database and retrieve Bearer token


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{host_url}}/auth/local/register
```



***Body:***

```js        
{
    "username": "test_user",
    "password": "TestPassword123!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Register



***Body:***

```js        
{
    "username": "test_user",
    "password": "TestPassword123!"
}
```



#### I. Example Response: Register
```js
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Nzc3NGI2LWViMTktNDdmZS05ZGE2LWZiMzc1OGMyZTg5ZSIsImlhdCI6MTY1MDk4NjUwNn0.Hn_TgscgY8R4mmhDhivxJkY0O0N-LfywSx3fWsf6--A",
    "user": {
        "username": "test_user"
    }
}
```


***Status Code:*** 200

<br>



### 2. Login


Login user and retrieve Bearer token


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{host_url}}/auth/local
```



***Body:***

```js        
{
    "username": "test_user",
    "password": "TestPassword123!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Login



***Body:***

```js        
{
    "username": "test_user",
    "password": "TestPassword123!"
}
```



#### I. Example Response: Login
```js
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Nzc3NGI2LWViMTktNDdmZS05ZGE2LWZiMzc1OGMyZTg5ZSIsImlhdCI6MTY1MDk4NjU5NX0.BLNVJBh7PnPjUp-RN0pwtN-ILT29H_cp3t1JvBAO81o",
    "user": {
        "username": "test_user"
    }
}
```


***Status Code:*** 200

<br>



## Cards

Cards API



### 1. Get all cards


Get all user's cards


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{host_url}}/cards
```



***More example Requests/Responses:***


#### I. Example Request: Get all cards



***Body: None***



#### I. Example Response: Get all cards
```js
[
    {
        "title": "Test title",
        "status": "to_do",
        "description": "Test",
        "id": "cf4ffe81-ef17-49a5-ae40-8c8e339225d5"
    },
    {
        "title": "Test title 2",
        "status": "to_do",
        "description": "Test",
        "id": "4c313c22-4f4b-4830-86ad-b4c9bfba3f5c"
    },
    {
        "title": "Test title 3",
        "status": "to_do",
        "description": "Test",
        "id": "e32925e2-e8d0-4ced-b7ae-cb99a603626a"
    }
]
```


***Status Code:*** 200

<br>



### 2. Get card


Get information about specified card


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{host_url}}/cards/2a438a08-d00a-4ec5-a7de-656880025ca8
```



***More example Requests/Responses:***


#### I. Example Request: Get card



***Body: None***



#### I. Example Response: Get card
```js
{
    "title": "Test title",
    "status": "to_do",
    "description": "Test",
    "id": "cf4ffe81-ef17-49a5-ae40-8c8e339225d5"
}
```


***Status Code:*** 200

<br>



### 3. Create card


Create new card


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{host_url}}/cards
```



***Body:***

```js        
{
    "title": "Test title",
    "status": "to_do",
    "description": "Test"
}
```



***More example Requests/Responses:***


#### I. Example Request: Create card



***Body:***

```js        
{
    "title": "Test title",
    "status": "to_do",
    "description": "Test"
}
```



#### I. Example Response: Create card
```js
{
    "title": "Test title",
    "status": "to_do",
    "description": "Test",
    "id": "cf4ffe81-ef17-49a5-ae40-8c8e339225d5"
}
```


***Status Code:*** 200

<br>



### 4. Update card


Update specified card


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{host_url}}/cards/2a438a08-d00a-4ec5-a7de-656880025ca8
```



***Body:***

```js        
{
    "title": "Test title updated",
    "status": "in_progress",
    "description": "Test updated"
}
```



***More example Requests/Responses:***


#### I. Example Request: Update card



***Body:***

```js        
{
    "title": "Test title updated",
    "status": "in_progress",
    "description": "Test updated"
}
```



#### I. Example Response: Update card
```js
{
    "title": "Test title updated",
    "status": "in_progress",
    "description": "Test updated",
    "id": "cf4ffe81-ef17-49a5-ae40-8c8e339225d5"
}
```


***Status Code:*** 200

<br>



### 5. Delete card


Delete specified card


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{host_url}}/cards/04a0cd26-70b8-408b-89b9-96d3a10df460
```



***More example Requests/Responses:***


#### I. Example Request: Delete card



***Body: None***



***Status Code:*** 200

<br>



---
[Back to top](#insysrestapi)
