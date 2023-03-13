# Node.js REST API application for managing contacts

This is a Node.js REST API application for managing contacts using MongoDB and Mongoose. This application allows users to create, read, update, and delete contacts.

## Requirements

Node.js installed on your machine
MongoDB instance running
NPM package manager installed

## Installation

1.Clone this repository or download the ZIP file and extract it to your desired directory.
2.Navigate to the project directory using a terminal or command prompt.
3.Run the following command to install the required dependencies: -`npm install`
4.Create a .env file in the project directory and add the following variables:

```env
DB_HOST=<your mongodb uri>
PORT=<your desired port>
SECRET_KEY=<your secret key>
```

5.Start the server by running the following command:

```env
npm start
```

6.You should see a message indicating that the server has started and is listening on the specified port.

## API endpoints

GET /api/contacts - Returns a list of all contacts.

POST /api/contacts - Creates a new contact.

GET /api/contacts/:contactId - Returns a single contact with the specified ID.

PUT /api/contacts/:contactId - Updates a single contact with the specified ID.

DELETE /api/contacts/:contactId - Deletes a single contact with the specified ID.

PATCH /api/contacts/:contactId/favorite - Updates only keys "favorite" in a single contact with the specified ID.

## Example usage

To create a new contact:

```json
POST /api/contacts
{
"name": "John Doe",
"email": "johndoe@example.com",
"phone": "123-456-7890"
}
```

To retrieve all contacts:

```json
GET /api/contacts
```

To retrieve a single contact with ID 123:

```json
GET /api/contacts/123
```

To update a single contact with ID 123:

```json
PUT /api/contacts/123
{
"name": "John Doe",
"email": "johndoe@example.com",
"phone": "111-222-3333"
}
```

To delete a single contact with ID 123:

```json
DELETE /api/contacts/123
```
