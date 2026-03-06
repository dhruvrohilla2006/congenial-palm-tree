import Food from "../Model/food.model.js";

export const foodHome  = async (request,response) => {
    try {
        console.log(request.file);
        return response.status(200).json({
            "message":"Image Uploaded Successfully",
            "success":true,
            "file":request.file
        })
    } catch (error) {
         console.log("Error at food Controller \t"+ error.message)
        return response.status(400).json({
        "message":"Image Not found",
        "success":false
      })
    }
}
export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({ available: true }).select("-createdBy -updatedAt -__v");
    return res.json(foods);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    return res.json(food);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createFood = async (req, res) => {
  try {
    const { name, price, description, category, available } = req.body;


    if (!name || !price || !description || !category || !req.file ) {
      return res
        .status(400)
        .json({ message: "name, price, description, category and image are required" });
    }

    let imageUrl = req.file.path; // fallback if you ever want to pass a direct URL

    // Cloudinary upload via buffer when an image file is provided
    // if (req.file) {
    //   const buffer = req.file.buffer;
    //   const uploaded = await new Promise((resolve, reject) => {
    //     const stream = cloudinary.uploader.upload_stream(
    //       { folder: "restaurant/foods" },
    //       (error, result) => {
    //         if (error) return reject(error);
    //         return resolve(result);
    //       },
    //     );
    //     stream.end(buffer);
    //   });
    //   imageUrl = uploaded.secure_url;
    // }

    const newFood = new Food({
      name,
      price,
      description,
      image: imageUrl,
      category,
      available,
      createdBy: req.user.id, // set by auth.middleware
    });

    const saved = await newFood.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const updates = { ...req.body };

    // if (req.file) {
    //   const buffer = req.file.buffer;
    //   const uploaded = await new Promise((resolve, reject) => {
    //     const stream = cloudinary.uploader.upload_stream(
    //       { folder: "restaurant/foods" },
    //       (error, result) => {
    //         if (error) return reject(error);
    //         return resolve(result);
    //       },
    //     );
    //     stream.end(buffer);
    //   });
    //   updates.image = uploaded.secure_url;
    // }

    const updated = await Food.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updated) return res.status(404).json({ message: "Food not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const removed = await Food.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Food not found" });
    res.json({ message: "Food deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};