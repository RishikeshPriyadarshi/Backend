const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Question = require("../models/Question");
const { body, validationResult } = require("express-validator");

//Route 1:ADD questions and answer: POST "/api/ques/addques". Login required
router.post(
  "/addques",fetchuser,
  [
    body("questions", "question cannot be empty").isArray({ min: 1 }),
    body("answers", "Answer cannot be empty").isArray({ min: 1 }),
  ],
  async (req, res) => {
    try {
        console.log(req.body.questions)
      const { questions, answers } = req.body;
      //if there is error then send responce
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const question = new Question({
        user: req.user.id,
        questions,
        answers,
      });
      const saveQues = await question.save();
      res.json(saveQues);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server occured");
    }
  }
);

//Router 2: Fetching all the questions and answer: GET "/api/ques/fetchallques"
router.get("/fetchallques", fetchuser, async (req, res) => {
  try {
    const question = await Question.find({ user: req.user.id });
    res.json(question);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error");
  }
});
module.exports = router;
