const request = require("supertest");
const app = require("../../../src/app");
const URLService = require("../../../src/services/URLService");
const URL = require("../../../src/models/URL");

describe("#URLRouter", () => {
  afterEach(async () => {
    jest.restoreAllMocks();
  });
  describe("GET /:key", () => {
    it("should return a 404 error", async () => {
      await request(app).get("/test").expect(404);
    });
    it("should return 200", async () => {
      await URL.create({
        key: "abcd",
        url: "https://www.google.com",
      });
      await request(app)
        .get("/abcd")
        .expect(200)
        .then((response) => {
          expect(response.body.url).toEqual("https://www.google.com");
        });
      await URL.deleteOne({
        url: "https://www.google.com",
      });
    });
  });
  describe("POST /", () => {
    it("should return a 400 due to invalid url", async () => {
      await request(app)
        .post("/")
        .send({
          url: "test",
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual("Invalid URL");
        });
    });
    it("should return 500", async () => {
      jest.spyOn(URLService, "addNewUrl").mockReturnValue("");
      await request(app)
        .post("/")
        .send({
          url: "https://www.google.com",
        })
        .expect(500)
        .then((response) => {
          expect(response.body.message).toEqual("Internal Server Error");
        });
    });
    it("should return 200", async () => {
      await request(app)
        .post("/")
        .send({
          url: "https://www.google.com",
        })
        .expect(200)
        .then((response) => {
          expect(response.body.key).toEqual(expect.any(String));
        });
      await URL.deleteOne({
        url: "https://www.google.com",
      });
    });
  });
});
