const express = require("express");
const getGoogleAccountFromCode = require('../src/google-util')

var router = express.Router();

router.get('/callback', async (req, res) => {
  const data = req.query;
  console.log(data, "REQUEST")
  try {
    const response = await getGoogleAccountFromCode(data.code);
    return res.status(200).json({ message: response })
  } catch (error) {
    console.log(error)

  }
})

module.exports = router;