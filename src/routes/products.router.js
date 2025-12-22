import {Router} from "express"
import ProductManager from "../dao/product-manager.js"

const router = Router();
const productManager = new ProductManager()
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAllProducts(req.query);
        res.json({ status: 'success', payload: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        res.json({ status: 'success', payload: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        
        if (!newProduct.name || !newProduct.price || !newProduct.code) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
        }

        const result = await productManager.addProduct(newProduct);

        res.status(201).json({ status: 'success', message: 'Producto creado correctamente', payload: result });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ status: 'error', message: 'El código del producto ya existe' });
        }
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updateData = req.body;
        delete updateData._id;

        const updatedProduct = await productManager.updateProduct(pid, updateData);

        res.json({ status: 'success', message: 'Producto actualizado', payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await productManager.deleteProduct(pid);

        if (!result) {
            return res.status(404).json({ status: 'error', message: 'No se pudo eliminar: Producto no encontrado' });
        }

        res.json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.patch('/bulk-update', async (req, res) => {
    try {
        const { ids, data } = req.body;
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Se requiere un array de IDs' });
        }

        const result = await productManager.bulkUpdate(ids, data);

        res.json({ status: 'success', message: `Se actualizaron ${result.modifiedCount} productos`, payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;