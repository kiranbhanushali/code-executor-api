const mongoose = require("mongoose");
const { Schema } = mongoose;
const problemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  category: [{ type: String }],
  markdown: {
    type: String,
    required: true,
  },
  meta: {
    accuracy: Number,
    submissions: Number,
  },
  input: [{ type: String, required: true }],
  output: [{ type: String, required: true }],
});

module.exports = mongoose.model("ProblemModel", problemSchema);
