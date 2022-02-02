const express = require("express");
const queryString = require('query-string');
const googleUtils = require('../src/google-util')


var router = express.Router();

router.get("/:user_id", async (req, res) => {
  try {
    const google_url = await googleUtils.urlGoogle();
    return res.status(200).json({ url: google_url })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: error })
  }
})

router.get('/callback', async (req, res) => {
  try {
    console,log("running", req.query)
    const data = req.query;
    const parsedData = queryString.parse(data.code)
    console.log(parsedData, "PDD")
    const response = await googleUtils.getGoogleAccountFromCode(parsedData);
    return res.status(200).json({ message: response })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: error })
  }
})

module.exports = router;