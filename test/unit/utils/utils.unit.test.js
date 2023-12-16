const utils = require("../../../src/utils/utils");

describe("#utils", () => {
  describe("#hexToDecimal", () => {
    it("should return a decimal from a hex string", () => {
      const result = utils.hexToDecimal("f");
      expect(result).toEqual(15);
    });
  });
  describe("#decimalToBase", () => {
    it("should return a base 62 value", () => {
      const result = utils.decimalToBase(99);
      expect(result).toEqual("1b");
    });
    it("should return 0", () => {
      const result = utils.decimalToBase(0);
      expect(result).toEqual("0");
    });
    it("should return 0 due to undefined params", () => {
      const result = utils.decimalToBase();
      expect(result).toEqual("0");
    });
  });

  describe("#hexToBase", () => {
    const result = utils.hexToBase("fffff");
      expect(result).toEqual("4OmV");
  });
});
