const express = require("express");
const { addNewUrl, getExistingUrl } = require("../services/URLService");

const router = express.Router();

router.get("/:key", async (req, res) => {
  const { key } = req.params;
  const url = await getExistingUrl(key);
  if (url) {
    return res.json(200, {
      url,
    });
  } else {
    return res.json(404, {
      message: "Not Found",
    });
  }
});

router.post("/", async (req, res) => {
  const { url } = req.body;

  let parsedUrl;
  // check if valid url
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    return res.json(400, {
      error: -2,
      message: "Invalid URL",
    });
  }
  try {
    const result = await addNewUrl(parsedUrl.href);
    if (result) {
      return res.json(200, {
        key: result,
      });
    } else {
      throw new Error("Key generation failed");
    }
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
  // check if there's existing data

  // add to database if new data
});

module.exports = router;
