import Product from "../models/productModel.js";

// Get all products
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query);
    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock,
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update only passed fields
    Object.assign(product, updates);
    // product.name = req.body.name || product.name;
    // product.description = req.body.description || product.description;
    // product.price = req.body.price || product.price;
    // product.image = req.body.image || product.image;
    // product.category = req.body.category || product.category;
    // product.stock = req.body.stock || product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all controllers 
export  {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
