import productModel from "../models/product.model.js";
class ProductManager {
    
    async getAllProducts(filters = {}) {
        try {
            const query = { active: true };
            
            if (filters.category) query.category = filters.category;
            if (filters.status) query.status = filters.status;
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { code: { $regex: filters.search, $options: 'i' } }
                ];
            }

            const products = await productModel.find(query).lean();
            return products;
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener los productos");
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id).lean();
            if (!product) throw new Error("Producto no encontrado");
            return product;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getProductByCode(code) {
        try {
            return await productModel.findOne({ code }).lean();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async addProduct(productData) {
        try {
            const exists = await productModel.findOne({ code: productData.code });
            if (exists) {
                throw new Error(`El código ${productData.code} ya existe.`);
            }

            const newProduct = await productModel.create(productData);
            return newProduct;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateProduct(id, updates) {
        try {
            const result = await productModel.findByIdAndUpdate(id, updates, { new: true }).lean();
            if (!result) throw new Error("Producto no encontrado para actualizar");
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productModel.findByIdAndUpdate(id, { active: false }, { new: true });
            if (!result) return false;
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async bulkUpdate(idsArray, updateData) {
        try {
            const result = await productModel.updateMany(
                { _id: { $in: idsArray } },
                { $set: updateData }
            );
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ProductManager