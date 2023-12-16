const URLService = require("../../../src/services/URLService");
const mongoose = require("mongoose");
const URL = require("../../../src/models/URL");

describe("#URLService", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe("#generateCandidates", () => {
    it("should return an array of candidates", () => {
      const objectId = new mongoose.Types.ObjectId("507f1f77bcf86cd799439012");
      const result = URLService.generateCandidates(objectId, 999);
      expect(result).toEqual(
        expect.arrayContaining([
          "1TOavf",
          "1TOavfG7",
          "1TOavfG7EMD",
          "1TOavfG7EMDIZs2",
        ])
      );
    });
    it("should return an array of candidates even with no milliseconds", () => {
      const objectId = new mongoose.Types.ObjectId("507f1f77bcf86cd799439012");
      const result = URLService.generateCandidates(objectId);
      expect(result).toEqual(
        expect.arrayContaining([
          "1TOavf",
          "1TOavf0",
          "1TOavf0EMD",
          "1TOavf0EMDIZs2",
        ])
      );
    });
  });

  describe("#checkCandidatesWithExistingKeys", () => {
    const candidates = ["1TOavf", "1TOavfG7", "1TOavfG7EMD", "1TOavfG7EMDIZs2"];
    it("should return all candidates posted due to no existing data found", async () => {
      const result =
        await URLService.checkCandidatesWithExistingKeys(candidates);
      expect(result).toEqual(candidates);
    });
    it("should return only 3 candidates", async () => {
      await URL.create({
        key: "1TOavf",
        url: "https://www.google.com",
      });
      const result =
        await URLService.checkCandidatesWithExistingKeys(candidates);
      expect(result).toEqual(["1TOavfG7", "1TOavfG7EMD", "1TOavfG7EMDIZs2"]);
      await URL.deleteOne({
        key: "1TOavf",
      });
    });
  });
  describe("#addNewURL", () => {
    it("should return null if 0 retry count is provided", async () => {
      const result = await URLService.addNewURL("https://www.google.com", 0);
      expect(result).toEqual(null);
    });
    it("should return existing key", async () => {
      await URL.create({
        key: "abcd",
        url: "https://www.google.com",
      });

      const result = await URLService.addNewURL("https://www.google.com");
      expect(result).toEqual("abcd");

      await URL.deleteOne({
        key: "abcd",
      });
    });
  });
  describe("#handleAttemptError", () => {
    it("should call a warn due to error message Ran out of candidates", () => {
      const error = new Error("Ran out of candidates");
      jest.spyOn(console, "warn");
      URLService.handleAttemptError(error, "", 1, 3);
      expect(console.warn).toHaveBeenCalledWith(
        "Transaction failed (attempt 1/3). Retrying..."
      );
    });
    it("should call duplicate URL Found", () => {
      jest.spyOn(console, "warn");
      const error = new mongoose.Error.ValidationError();
      error.code = 11000;
      error.message =
        'MongoServerError: E11000 duplicate key error collection: test.urls index: url_1 dup key: { url: "https://www.google.com" }';
      URLService.handleAttemptError(error, "https://www.google.com", 1, 2);
      expect(console.warn).toHaveBeenCalledWith(
        "Duplicate URL found (attempt 1/2). Retrying..."
      );
    });
    it("should throw an error", () => {
      expect.assertions(2);
      try {
        URLService.handleAttemptError(new Error("test"), "", 1, 3);
      } catch (error) {
        expect(URLService.handleAttemptError).toThrow();
        expect(error.message).toEqual("test");
      }
    });
  });
});
