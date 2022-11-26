# Ephemeral File Sharing API

The service allows the web app to upload images, which the server saves inside a new MongoDB document and provides an endpoint for serving the uploaded images (aka shareable URLs)

In addition, the documents in the "files" collection are being automatically deleted using the "expireAfterSeconds" MongoDB index (once they reach their specified expiration date)

## Tools
* Runtime: NodeJS
* Language: TypeScript
* Framework: Express
* Database: MongoDB (using the official MongoDB driver for NodeJS)

## How-to-run
* Create .env file in the root folder
* Add the following env vars to the .env file
  * DB_URI={reach out to me}
  * API_URL=http://localhost:8080
  * WEB_APP_URL=http://localhost:3000
* npm i
* npm start