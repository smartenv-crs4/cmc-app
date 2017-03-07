For more info about the project, please visit the [CagliariPortt2020 official website](http://cp2020.crs4.it)

Security & Authentication
-------------------------
All API endpoints use **HTTPS** protocol.

All API endpoints **MUST require authentication**.



Thus, you MUST obtain an API token and use it in HTTP header, as in:

    Authentication: Bearer <API_TOKEN>

or appending a URL parameter as in:

    /apps?access_token=<API_TOKEN>

or appending in body request as in:

        {access_token=<API_TOKEN>}

***

Pagination
-------------------------

All endpoints providing a listing functionality, like `/apps`, returns paginated responses.
Pagination information is always provided using the following format:

    ...
    "_metadata":{
                    "skip":10,
                    "limit":50,
                    "totalCount":1500
                }


Access_Token
------------
Access_token to try API:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoibXMiLCJpc3MiOiJub3QgdXNlZCBmbyBtcyIsImVtYWlsIjoibm90IHVzZWQgZm8gbXMiLCJ0eXBlIjoiYXV0aG1zIiwiZW5hYmxlZCI6dHJ1ZSwiZXhwIjoxNzk2MDUxMTIxNzAwfQ.rfKWx6EVbTbopQZOD4NLr1vM6MaBw5FvKod9Pj8MGps