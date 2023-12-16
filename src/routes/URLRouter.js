const express = require("express");
const mongoose = require("mongoose");
const { addNewURL } = require("../services/URLService");

const router = express.Router();

router.get("/:id", async (req, res) => {
  // check cache
  // ch
  // const acceptHeader = req.get('Accept');
  // if (acceptHeader.includes('application/json')) {
  //   res.json({ message: 'This is a JSON response' });
  // } else if (acceptHeader.includes('text/html')) {
  //   res.send('<p>This is an HTML response</p>');
  // } else {
  //   res.status(406).send('Not Acceptable: Supported types are JSON and HTML');
  // }
  return res.json(200, {});
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
    const result = await addNewURL(parsedUrl.href);
    if (result) {
      return res.json(200, {
        key: result.key,
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
