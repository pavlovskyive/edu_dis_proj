
# InSysRestAPI

Project management system REST API for 'Information systems' class of Kyiv Polytechnic Institute.

<!--- If we have only one group/collection, then no need for the "ungrouped" heading -->



## Endpoints

* [Auth](#auth)
    1. [Register](#1-register)
        * [Example](#i-example-request-example)
    1. [Login](#2-login)
        * [Example](#i-example-request-example-1)
* [Cards](#cards)
    1. [Get all cards](#1-get-all-cards)
        * [Example](#i-example-request-example-2)
    1. [Get card](#2-get-card)
        * [Example](#i-example-request-example-3)
    1. [Create card](#3-create-card)
        * [Example](#i-example-request-example-4)
    1. [Update card](#4-update-card)
        * [Example](#i-example-request-example-5)
    1. [Delete card](#5-delete-card)
        * [Example](#i-example-request-example-6)

--------



## Auth

Authentication API



### 1. Register


Register user in database and retrieve Bearer token


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://localhost:3000/auth/local/register
```



***Body:***

```js        
{
    "username": "test_user",
    "password": "TestPassword123!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Example



***Body:***

```js        
{
    "username": "test_user",
    "password": "TestPassword123!"
}
```



#### I. Example Response: Example
```js
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQzNzcxMDI0LWNhNDktNDFmYS05ODQ5LTNlYjRlMjcyOWIzYSIsImlhdCI6MTY1MDk3MzU5Nn0.ccPCj1DjN0nc-du6x9gjXU8qM3ftONf8zf-6ED614vE",
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
URL: http://localhost:3000/auth/local
```



***Body:***

```js        
{
    "username": "test_user",
    "password": "TestPassword123!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Example



***Body:***

```js        
{
    "username": "test_user",
    "password": "TestPassword123!"
}
```



#### I. Example Response: Example
```js
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQzNzcxMDI0LWNhNDktNDFmYS05ODQ5LTNlYjRlMjcyOWIzYSIsImlhdCI6MTY1MDk3MzYxNX0.FQpDkbZH3TsFL24v8lzCmN8ZXLjFnpTP4JUjyeXf3pA",
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
URL: http://localhost:3000/cards
```



***More example Requests/Responses:***


#### I. Example Request: Example



***Body: None***



#### I. Example Response: Example
```js
[
    {
        "title": "Test title",
        "status": "to_do",
        "description": "Test",
        "id": "2a438a08-d00a-4ec5-a7de-656880025ca8"
    },
    {
        "title": "Test title 2",
        "status": "to_do",
        "description": "Test",
        "id": "6dd6ff4c-03d2-40b0-95ac-153d2a6d86d2"
    },
    {
        "title": "Test title 3",
        "status": "to_do",
        "description": "Test",
        "id": "04a0cd26-70b8-408b-89b9-96d3a10df460"
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
URL: http://localhost:3000/cards/2a438a08-d00a-4ec5-a7de-656880025ca8
```



***More example Requests/Responses:***


#### I. Example Request: Example



***Body: None***



#### I. Example Response: Example
```js
{
    "title": "Test title updated",
    "status": "in_progress",
    "description": "Test updated",
    "id": "2a438a08-d00a-4ec5-a7de-656880025ca8"
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
URL: http://localhost:3000/cards
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


#### I. Example Request: Example



***Body:***

```js        
{
    "title": "Test title 2",
    "status": "to_do",
    "description": "Test"
}
```



#### I. Example Response: Example
```js
{
    "title": "Test title",
    "status": "to_do",
    "description": "Test",
    "id": "2a438a08-d00a-4ec5-a7de-656880025ca8"
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
URL: http://localhost:3000/cards/2a438a08-d00a-4ec5-a7de-656880025ca8
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


#### I. Example Request: Example



***Body:***

```js        
{
    "title": "Test title updated",
    "status": "in_progress",
    "description": "Test updated"
}
```



#### I. Example Response: Example
```js
{
    "title": "Test title updated",
    "status": "in_progress",
    "description": "Test updated",
    "id": "2a438a08-d00a-4ec5-a7de-656880025ca8"
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
URL: http://localhost:3000/cards/04a0cd26-70b8-408b-89b9-96d3a10df460
```



***More example Requests/Responses:***


#### I. Example Request: Example



***Body: None***



***Status Code:*** 200

<br>



---
[Back to top](#insysrestapi)
