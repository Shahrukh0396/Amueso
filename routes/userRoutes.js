const express = require("express");
const User = require("../models/userModel");
const Joi = require('joi');

var router = express.Router();

router.post("/signup", async (req, res) => {
  const data = req.body;
  console.log("post", data)
  try {
    const schema = Joi.object({
      password: Joi.string().min(8).required(),
      email: Joi.string().email(),
      name: Joi.string().required()
    });

    const value = await schema.validateAsync(data);
    if (!value.error) {
      const { email } = req.body;
      const existemail = await User.findOne({ email });
      console.log("exsist", existemail)
      if (existemail) {
        console.log({ existemail })
        return res.status(403).json({ message: "Email or Username Already exists", error: true });
      } else {
        // let token = Math.random();
        // token = token.toString("hex");
        // data["token"] = token;
        let user = new User(data);
        user.save((err, user) => {
          console.log(err, user, "saveuser")
          if (!err) {
            user.salt = undefined;
            user.hash_password = undefined;
            console.log('done', user)
            return res.status(200).json({
              message: "Your Account is Successfully Created",
              data: user,
              error: false
            });
          } else {
            return res.status(400).json({ error: true, message: err });
          }
        })
      }
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: err.message,
      error: true
    });
  }
});

router.post("/login", async (req, res) => {
  let data = req.body;
  console.log(data, "BODY")
  const schema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
  });
  try {
    const value = await schema.validateAsync(data);
    if (!value.error) {
      let user;
      user = await User.findOne({ email: data.email });
      if (!user) {
        user = await User.findOne({ username: data.email });
        return res.status(404).json({ error: true, message: "User not found" });
      }
      if (!user.authentication(data.password)) {
        return res.status(401).json({ error: true, message: "Password incorrect" });
      }
      user.save();
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        success: true,
        status: "you are succesfully logged in",
        data: user,
      });
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: err.message,
      error: true

    });
  }
})

router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ _id: user_id })
    if (user) {
      return res.status(200).json({
        data: user
      })
    } else {
      console.log("fix api")
    }
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: err.message
    })
  }
})

module.exports = router;