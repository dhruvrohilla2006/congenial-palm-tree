import mongoose from "mongoose";

const foodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    minLength: 10,
    maxLenght: 40,
  },
  description: {
    type: String,
    required: true,
    minLength: 40,
    maxLenght: 500,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: [String],
    required: true,
  },
  category: {
    type: [String],
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Food = mongoose.model("Food", foodSchema);
export default Food;
