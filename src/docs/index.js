const URLModelSwagger = require("./models/URL.json");
const URLRouterSwagger = require("./routes/URLRouter.json");

module.exports = {
  tags: [
    {
      name: "URL Shortener",
      description: "URL Shortener API",
    },
  ],
  components: {
    schemas: {
      ...URLModelSwagger,
    },
  },
  paths: {
    ...URLRouterSwagger,
  },
};
