class ProductManager {
    constructor() {
        this.API_URL = 'http://localhost:8080/api/products';
    }

    async getAllProducts(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `${this.API_URL}?${queryParams}` : this.API_URL;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.payload;
            } else {
                return [];
            }
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.payload;
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async addProduct(productData) {
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                return data.payload;
            } else {
                throw new Error(data.message || 'Error al crear producto');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateProduct(id, updates) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (data.status === 'success') {
                return data.payload;
            } else {
                throw new Error(data.message || 'Error al actualizar producto');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            return data.status === 'success';
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async bulkUpdate(ids, updateData) {
        try {
            const response = await fetch(`${this.API_URL}/bulk-update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids, data: updateData })
            });

            const data = await response.json();
            return data.status === 'success';
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}