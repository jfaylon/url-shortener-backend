const hexToDecimal = (hexString) => {
  let decimalResult = 0;
  for (let i = 0; i < hexString.length; i++) {
    const hexCharacter = hexString[i];
    const hexDigit = parseInt(hexCharacter, 16);
    decimalResult = decimalResult * 16 + hexDigit;
  }

  return decimalResult;
};

const decimalToBase = (value = 0, base = 62) => {
  // this can be customised
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  while (value > 0) {
    const remainder = value % base;
    result = characters[remainder] + result;
    value = Math.floor(value / base);
  }

  return result || "0";
};

const hexToBase = (hexString, base) => {
  const decimal = hexToDecimal(hexString);
  return decimalToBase(decimal, base);
};

module.exports = {
  hexToDecimal,
  decimalToBase,
  hexToBase
};
