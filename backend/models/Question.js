const mongoose = require("mongoose");
const { Schema } = mongoose;
const QuestionSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  questions: {
    type: [String],
    required: true,
  },
  answers: {
    type: [String],
    required: true,
  },
});
module.exports = mongoose.model("notes", QuestionSchema);
