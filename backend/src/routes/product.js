import express from 'express';
import { createProduct, getProducts, deleteProduct, deleteAllProductsForFarmer ,updateProduct} from '../controllers/productController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createProduct);
router.get('/', getProducts);
router.delete('/:id', auth, deleteProduct);
router.delete('/', auth, deleteAllProductsForFarmer);
// Update a product by ID
router.put('/:id', auth, updateProduct);

export default router;
