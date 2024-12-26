import express from "express";
import { validationResult, body } from "express-validator";
import AdminCategory from "#modules/adminCategory.js";

const categoriesRouter = express.Router();

categoriesRouter.post(
  "/",
  [
    body("name").isString().withMessage("Name must be a string"),
    body("order").isInt().withMessage("Order must be an integer"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      if (!req.body.name || !req.body.order) {
        return res
          .status(400)
          .json({ message: "Name and order are required." });
      }

      const newCategory = new AdminCategory({
        name: req.body.name,
        order: req.body.order,
        image: null,
        listingImage: null,
      });

      const savedCategory = await newCategory.save();
      const { ...categoryData } = savedCategory._doc;

      res.json({ ...categoryData });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Failed to fetch categories. Try again later." });
    }
  }
);

categoriesRouter.get("/", async (req, res) => {
  try {
    const categories = await AdminCategory.find();
    res.json(categories);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to fetch categories. Try again later." });
  }
});

categoriesRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await AdminCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.json({ message: "Category deleted successfully.", deletedCategory });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to delete category. Try again later." });
  }
});

categoriesRouter.patch("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id; 
    const { name, order, image, listingImage } = req.body; 

    if (!name && !order && !image && !listingImage) {
      return res.status(400).json({ message: "At least one field must be provided for update." });
    }

    const category = await AdminCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    category.name = name || category.name;
    category.order = order || category.order;
    category.image = image || category.image;
    category.listingImage = listingImage || category.listingImage;

    const updatedCategory = await category.save();

    res.json(updatedCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update category. Try again later." });
  }
});

export default categoriesRouter;
