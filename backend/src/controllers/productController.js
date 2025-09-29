import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    // Destructure all expected fields from req.body
    const {
      name,
      description,
      price,
      type,
      quantity,
      unit,
      harvestDate,
      expiryDate,
      quality,
      location,
      organic,
      images,
      status
    } = req.body;
    // Create product with all fields
    const product = new Product({
      name,
      description,
      price,
      createdBy: req.user.id,
      type,
      quantity,
      unit,
      harvestDate,
      expiryDate,
      quality,
      location,
      organic,
      images,
      status
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;  // product ID
  const { name, price, description, quantity } = req.body;  // fields to update

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, quantity },
      { new: true }  // return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { farmerId } = req.query;

    // If farmerId exists, filter by createdBy
    const filter = farmerId ? { createdBy: farmerId } : {};

    const products = await Product.find(filter).populate('createdBy', 'name email');
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') {
      return res.status(400).json({ error: 'Valid product id required' });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteAllProductsForFarmer = async (req, res) => {
  try {
    const { farmerId } = req.query;
    if (!farmerId) return res.status(400).json({ error: 'farmerId required' });
    await Product.deleteMany({ farmerId });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
