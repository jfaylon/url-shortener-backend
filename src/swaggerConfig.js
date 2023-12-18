const swaggerJsdoc = require("swagger-jsdoc");
const swaggerData = require("./docs/index");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "url-shortener-backend",
      version: "1.0.0",
      description: "API documentation for the url-shortener-backend",
    },
    ...swaggerData,
  },
  apis: ["**/routes/*.js"],
};

console.log(JSON.stringify(options));
const specs = swaggerJsdoc(options);

module.exports = specs;
