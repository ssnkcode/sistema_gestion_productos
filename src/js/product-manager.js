// product-manager.js - Gestión completa de productos

class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || this.loadSampleProducts();
        this.currentProductId = this.getNextId();
    }

    // Cargar productos de ejemplo iniciales
    loadSampleProducts() {
        const sampleProducts = [
            { id: 1, name: "Arroz Premium 1kg", category: "Alimentos", price: 2.50, stock: 45, status: "in-stock", supplier: "Distribuidora Martínez", sku: "ARROZ001" },
            { id: 2, name: "Aceite Vegetal 1L", category: "Alimentos", price: 3.80, stock: 22, status: "in-stock", supplier: "Mayorista Central", sku: "ACEIT002" },
            { id: 3, name: "Detergente Líquido 2L", category: "Limpieza", price: 5.20, stock: 15, status: "low-stock", supplier: "Importadora del Norte", sku: "DETER003" },
            { id: 4, name: "Café Molido 500g", category: "Alimentos", price: 7.50, stock: 8, status: "low-stock", supplier: "Distribuidora Martínez", sku: "CAFEM004" },
            { id: 5, name: "Papel Higiénico 12 rollos", category: "Hogar", price: 4.30, stock: 0, status: "out-of-stock", supplier: "Mayorista Central", sku: "PAPEL005" },
            { id: 6, name: "Leche Entera 1L", category: "Lácteos", price: 1.20, stock: 32, status: "in-stock", supplier: "Distribuidora Martínez", sku: "LECHE006" },
            { id: 7, name: "Galletas de Chocolate", category: "Snacks", price: 2.10, stock: 28, status: "in-stock", supplier: "Importadora del Norte", sku: "GALL007" },
            { id: 8, name: "Shampoo Anticaspa 400ml", category: "Cuidado Personal", price: 6.40, stock: 12, status: "low-stock", supplier: "Mayorista Central", sku: "SHAM008" }
        ];
        
        localStorage.setItem('products', JSON.stringify(sampleProducts));
        return sampleProducts;
    }

    // Obtener siguiente ID
    getNextId() {
        if (this.products.length === 0) return 1;
        return Math.max(...this.products.map(p => p.id)) + 1;
    }

    // Obtener todos los productos
    getAllProducts() {
        return this.products;
    }

    // Obtener producto por ID
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    // Agregar nuevo producto
    addProduct(productData) {
        const newProduct = {
            id: this.currentProductId++,
            name: productData.name,
            category: productData.category,
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock),
            status: this.calculateStatus(productData.stock),
            supplier: productData.supplier,
            sku: productData.sku || this.generateSKU(productData.category),
            createdAt: new Date().toISOString()
        };

        this.products.unshift(newProduct); // Agregar al inicio
        this.saveToLocalStorage();
        return newProduct;
    }

    // Actualizar producto
    updateProduct(id, updates) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return null;

        // Actualizar solo los campos proporcionados
        this.products[index] = {
            ...this.products[index],
            ...updates,
            status: updates.stock !== undefined ? this.calculateStatus(updates.stock) : this.products[index].status
        };

        this.saveToLocalStorage();
        return this.products[index];
    }

    // Eliminar producto
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.products.splice(index, 1);
        this.saveToLocalStorage();
        return true;
    }

    // Calcular estado según stock
    calculateStatus(stock) {
        stock = parseInt(stock);
        if (stock === 0) return "out-of-stock";
        if (stock < 10) return "low-stock";
        return "in-stock";
    }

    // Generar SKU automático
    generateSKU(category) {
        const prefix = category.substring(0, 3).toUpperCase();
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${random}`;
    }

    // Guardar en localStorage
    saveToLocalStorage() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    // Importar desde array (para Excel)
    importProducts(productsArray, options = { updateExisting: true, addNew: true }) {
        let importedCount = 0;
        let updatedCount = 0;

        productsArray.forEach(productData => {
            // Buscar si ya existe (por nombre o SKU)
            const existingIndex = this.products.findIndex(p => 
                p.sku === productData.sku || p.name.toLowerCase() === productData.name.toLowerCase()
            );

            if (existingIndex !== -1 && options.updateExisting) {
                // Actualizar producto existente
                this.products[existingIndex] = {
                    ...this.products[existingIndex],
                    price: productData.price || this.products[existingIndex].price,
                    stock: productData.stock || this.products[existingIndex].stock,
                    category: productData.category || this.products[existingIndex].category,
                    supplier: productData.supplier || this.products[existingIndex].supplier,
                    status: this.calculateStatus(productData.stock || this.products[existingIndex].stock)
                };
                updatedCount++;
            } else if (options.addNew) {
                // Agregar nuevo producto
                this.addProduct(productData);
                importedCount++;
            }
        });

        this.saveToLocalStorage();
        return { imported: importedCount, updated: updatedCount };
    }
}

// Exportar para usar en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductManager;
}