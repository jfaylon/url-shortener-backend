# url-shortener-backend

## Prerequisites

### Tech Stack
- Node.js v21.2.0
- MongoDB v7.0.3 (Must be connected to a Replica Set)

### Frontend Repository (Optional)

https://github.com/jfaylon/url-shortener-frontend


## Installation

### Install node modules
After cloning the repository, Go to the folder and install the modules

```bash
  npm install
```
OR 
```bash
  npm ci
```

### Add ENVs
Next, add your `.env` file to the root directory.

It will look like this. Please provide the necessary inputs:

```
PORT=
MONGO_URI=
```

OR

You can copy the `.env.example` provided and paste it as `.env`

The `.env.example` contains these:

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/urlShortener?replicaSet=rs0
```

## Running the application
There are 2 ways:

- If you want to restart the application based on any change in the code (Only for development purposes):

```
npm run start:dev
```
OR
-  The normal way which requires restart for every change (Ideal for production environment):

```
npm run start
```

## Testing
You can run the unit tests by running this command:

```
npm run test
```

## API Documentation

It can be found by calling the route `/api-docs` upon running the application.

Example:

```
http://localhost:8000/api-docs
```

OR

It can be found in the `assets/api-documentation.pdf` in the repository

## Notes

### Assumptions
- Links never expire.
- Since there are no set character limits, the candidates are in various lengths to support the scalability of the platform such as multiple servers processing multiple inserts at a given time. Multiple key candidates can be formed as per need.

### Tech Limitations and Possible Improvements
- This API must be connected to a MongoDB Replica Set for the transactions feature.
- Counters can be used to count the number of uses of the shortened URL for analytics.
- Caching of recently used shortened urls can be implemented to lessen the database hits.
- A module for generating the keys can be used to be the source of truth of the keys to lessen the conflicts.
- The Node and MongoDB versions mentioned in the tech stack have been used. Other versions of Node and MongoDB have not been tested yet so this application may not work on for older or newer versions.
- The tests are using an in-memory MongoDB database. There may be functions that are not available compared to the real MongoDB server.
- The key generation can be modified as per need such as reordering the characters
