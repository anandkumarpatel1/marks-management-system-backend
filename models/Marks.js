const mongoose = require("mongoose");


const marksModel = mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, "Please Enter marks"],
    },
    subject: {
      type: String,
      required: [true, "Please Enter your subject"],
    },
    testNo:{
        type: String,
        required: [true, "Please Enter Test"],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  {
    timestamps: true,
  }
);

const Marks = mongoose.model("Marks", marksModel);

module.exports = Marks;
