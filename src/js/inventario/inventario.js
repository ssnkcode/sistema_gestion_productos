// inventario.js - Funcionalidad para la sección de inventario

document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const closeProductModal = document.getElementById('closeProductModal');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const productForm = document.getElementById('productForm');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const selectAllCheckbox = document.getElementById('selectAll');
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    const exportBtn = document.getElementById('exportBtn');
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const bulkUpdateModal = document.getElementById('bulkUpdateModal');
    const closeBulkModal = document.getElementById('closeBulkModal');
    const cancelBulkBtn = document.getElementById('cancelBulkBtn');
    const applyBulkBtn = document.getElementById('applyBulkBtn');
    const bulkUpdateBtn = document.getElementById('bulkUpdateBtn');
    const bulkActionSelect = document.getElementById('bulkAction');
    const bulkActionDetails = document.getElementById('bulkActionDetails');
    const bulkActionValue = document.getElementById('bulkActionValue');
    const selectedCount = document.getElementById('selectedCount');
    const selectedProductsList = document.getElementById('selectedProductsList');
    
    // Variables globales
    let currentProductId = null;
    let selectedProducts = new Set();
    let productsData = [];
    let currentPage = 1;
    const itemsPerPage = 15;
    
    // Datos de ejemplo para productos
    const sampleProducts = [
        {
            id: 1,
            name: "Laptop Dell XPS 13",
            code: "LP-DLXPS13",
            category: "electronica",
            price: 1299.99,
            salePrice: 1499.99,
            stock: 15,
            minStock: 5,
            maxStock: 50,
            status: "in-stock",
            supplier: "Distribuidora Martínez",
            description: "Laptop ultrabook con pantalla InfinityEdge",
            active: true
        },
        {
            id: 2,
            name: "Smartphone Samsung Galaxy S23",
            code: "SP-SGS23",
            category: "electronica",
            price: 799.99,
            salePrice: 899.99,
            stock: 32,
            minStock: 10,
            maxStock: 100,
            status: "in-stock",
            supplier: "Mayorista Central",
            description: "Teléfono inteligente flagship de Samsung",
            active: true
        },
        {
            id: 3,
            name: "Camiseta Algodón Premium",
            code: "CT-ALGPRE",
            category: "ropa",
            price: 12.50,
            salePrice: 24.99,
            stock: 3,
            minStock: 10,
            maxStock: 200,
            status: "low-stock",
            supplier: "Importadora del Norte",
            description: "Camiseta 100% algodón de alta calidad",
            active: true
        },
        {
            id: 4,
            name: "Aceite de Oliva Extra Virgen",
            code: "AL-AOEV1L",
            category: "alimentos",
            price: 8.75,
            salePrice: 14.99,
            stock: 0,
            minStock: 20,
            maxStock: 150,
            status: "out-of-stock",
            supplier: "Proveedor Externo",
            description: "Aceite de oliva premium 1 litro",
            active: true
        },
        {
            id: 5,
            name: "Silla de Oficina Ergonómica",
            code: "HG-SILLERG",
            category: "hogar",
            price: 89.99,
            salePrice: 149.99,
            stock: 7,
            minStock: 5,
            maxStock: 30,
            status: "low-stock",
            supplier: "Distribuidora Martínez",
            description: "Silla ergonómica con soporte lumbar",
            active: true
        },
        {
            id: 6,
            name: "Monitor LG 27\" 4K",
            code: "EL-MONLG4K",
            category: "electronica",
            price: 349.99,
            salePrice: 449.99,
            stock: 12,
            minStock: 5,
            maxStock: 40,
            status: "in-stock",
            supplier: "Mayorista Central",
            description: "Monitor 4K UHD para diseño y gaming",
            active: true
        },
        {
            id: 7,
            name: "Zapatos Deportivos Running",
            code: "RP-ZAPRUN",
            category: "ropa",
            price: 35.00,
            salePrice: 69.99,
            stock: 24,
            minStock: 10,
            maxStock: 100,
            status: "in-stock",
            supplier: "Importadora del Norte",
            description: "Zapatos para running con amortiguación",
            active: true
        },
        {
            id: 8,
            name: "Café en Grano Premium",
            code: "AL-CAFGRAN",
            category: "alimentos",
            price: 15.50,
            salePrice: 24.99,
            stock: 18,
            minStock: 15,
            maxStock: 120,
            status: "in-stock",
            supplier: "Proveedor Externo",
            description: "Café en grano tostado medio 500g",
            active: true
        },
        {
            id: 9,
            name: "Escritorio de Madera",
            code: "HG-ESCMAD",
            category: "hogar",
            price: 120.00,
            salePrice: 199.99,
            stock: 4,
            minStock: 5,
            maxStock: 25,
            status: "low-stock",
            supplier: "Distribuidora Martínez",
            description: "Escritorio de madera maciza",
            active: true
        },
        {
            id: 10,
            name: "Impresora Multifunción",
            code: "OF-IMPMULT",
            category: "oficina",
            price: 89.99,
            salePrice: 129.99,
            stock: 9,
            minStock: 5,
            maxStock: 30,
            status: "in-stock",
            supplier: "Mayorista Central",
            description: "Impresora láser multifunción",
            active: true
        }
    ];
    
    // Inicializar datos
    productsData = [...sampleProducts];
    
    // Funciones de utilidad
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    function getStockStatus(stock, minStock) {
        if (stock === 0) return "out-of-stock";
        if (stock <= minStock) return "low-stock";
        return "in-stock";
    }
    
    function getStatusText(status) {
        const statusMap = {
            'in-stock': 'En Stock',
            'low-stock': 'Stock Bajo',
            'out-of-stock': 'Agotado'
        };
        return statusMap[status] || status;
    }
    
    // Renderizar tabla de productos
    function renderProductsTable(products = productsData) {
        inventoryTableBody.innerHTML = '';
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);
        
        if (paginatedProducts.length === 0) {
            inventoryTableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px;">
                        <div style="font-size: 1.2rem; color: #7f8c8d; margin-bottom: 10px;">
                            <i class="fas fa-box-open" style="font-size: 3rem;"></i>
                        </div>
                        <div style="font-size: 1rem; color: #7f8c8d;">
                            No se encontraron productos que coincidan con la búsqueda
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        paginatedProducts.forEach(product => {
            const isSelected = selectedProducts.has(product.id);
            const status = getStockStatus(product.stock, product.minStock);
            const statusText = getStatusText(status);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="product-checkbox" data-id="${product.id}" ${isSelected ? 'checked' : ''}>
                </td>
                <td>
                    <div class="product-cell">
                        <div class="product-image-small">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <div class="product-description">${product.description}</div>
                        </div>
                    </div>
                </td>
                <td>${product.code}</td>
                <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
                <td>${formatCurrency(product.salePrice)}</td>
                <td>${product.stock}</td>
                <td>
                    <span class="stock-status ${status}">${statusText}</span>
                </td>
                <td>${product.supplier}</td>
                <td>
                    <div class="table-actions">
                        <div class="action-icon edit" title="Editar" data-id="${product.id}">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="action-icon delete" title="Eliminar" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </div>
                    </div>
                </td>
            `;
            inventoryTableBody.appendChild(row);
        });
        
        // Actualizar información de paginación
        updatePaginationInfo(products.length);
        
        // Agregar eventos a los checkboxes y botones
        attachTableEvents();
    }
    
    function updatePaginationInfo(totalProducts) {
        const pageInfo = document.querySelector('.page-info');
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalProducts);
        
        if (pageInfo) {
            pageInfo.textContent = `Mostrando ${startItem}-${endItem} de ${totalProducts} productos`;
        }
        
        // Actualizar números de página
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        updatePageNumbers(totalPages);
    }
    
    function updatePageNumbers(totalPages) {
        const pageNumbersContainer = document.querySelector('.page-numbers');
        if (!pageNumbersContainer) return;
        
        pageNumbersContainer.innerHTML = '';
        
        // Mostrar máximo 5 números de página
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                renderProductsTable(getFilteredProducts());
            });
            pageNumbersContainer.appendChild(pageNumber);
        }
        
        // Actualizar estado de botones de paginación
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        
        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage === 1;
            prevPageBtn.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderProductsTable(getFilteredProducts());
                }
            };
        }
        
        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage === totalPages;
            nextPageBtn.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderProductsTable(getFilteredProducts());
                }
            };
        }
    }
    
    function getFilteredProducts() {
        let filtered = [...productsData];
        
        // Filtrar por búsqueda
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.code.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filtrar por categoría
        const category = categoryFilter.value;
        if (category) {
            filtered = filtered.filter(product => product.category === category);
        }
        
        // Filtrar por estado
        const status = statusFilter.value;
        if (status) {
            filtered = filtered.filter(product => {
                const productStatus = getStockStatus(product.stock, product.minStock);
                return productStatus === status;
            });
        }
        
        return filtered;
    }
    
    function attachTableEvents() {
        // Checkboxes de productos
        document.querySelectorAll('.product-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                
                if (this.checked) {
                    selectedProducts.add(productId);
                } else {
                    selectedProducts.delete(productId);
                    selectAllCheckbox.checked = false;
                }
                
                updateSelectedCount();
            });
        });
        
        // Botones de editar
        document.querySelectorAll('.action-icon.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                openEditProductModal(productId);
            });
        });
        
        // Botones de eliminar
        document.querySelectorAll('.action-icon.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = productsData.find(p => p.id === productId);
                if (product) {
                    openConfirmDeleteModal(product);
                }
            });
        });
    }
    
    function updateSelectedCount() {
        selectedCount.textContent = selectedProducts.size;
        
        // Actualizar lista de productos seleccionados
        selectedProductsList.innerHTML = '';
        selectedProducts.forEach(id => {
            const product = productsData.find(p => p.id === id);
            if (product) {
                const item = document.createElement('div');
                item.className = 'selected-product-item';
                item.innerHTML = `
                    <span>${product.name}</span>
                    <span>${product.code}</span>
                `;
                selectedProductsList.appendChild(item);
            }
        });
        
        // Habilitar/deshabilitar botón de aplicar cambios
        applyBulkBtn.disabled = selectedProducts.size === 0 || !bulkActionSelect.value;
    }
    
    // Funciones para modales
    function openAddProductModal() {
        currentProductId = null;
        document.getElementById('modalTitle').textContent = 'Agregar Nuevo Producto';
        productForm.reset();
        productModal.classList.add('active');
    }
    
    function openEditProductModal(productId) {
        const product = productsData.find(p => p.id === productId);
        if (!product) return;
        
        currentProductId = productId;
        document.getElementById('modalTitle').textContent = 'Editar Producto';
        
        // Llenar formulario con datos del producto
        document.getElementById('productName').value = product.name;
        document.getElementById('productCode').value = product.code;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productSupplier').value = product.supplier;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productSalePrice').value = product.salePrice;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productMinStock').value = product.minStock;
        document.getElementById('productMaxStock').value = product.maxStock;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productActive').checked = product.active;
        
        productModal.classList.add('active');
    }
    
    function openConfirmDeleteModal(product) {
        document.getElementById('productToDeleteName').textContent = `${product.name} (${product.code})`;
        confirmDeleteModal.classList.add('active');
        currentProductId = product.id;
    }
    
    function openBulkUpdateModal() {
        bulkUpdateModal.classList.add('active');
        updateSelectedCount();
    }
    
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    // Funciones para manejar productos
    function saveProduct() {
        if (!productForm.checkValidity()) {
            productForm.reportValidity();
            return;
        }
        
        const productData = {
            id: currentProductId || Date.now(),
            name: document.getElementById('productName').value,
            code: document.getElementById('productCode').value,
            category: document.getElementById('productCategory').value,
            supplier: document.getElementById('productSupplier').value,
            price: parseFloat(document.getElementById('productPrice').value),
            salePrice: parseFloat(document.getElementById('productSalePrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            minStock: parseInt(document.getElementById('productMinStock').value),
            maxStock: parseInt(document.getElementById('productMaxStock').value),
            description: document.getElementById('productDescription').value,
            active: document.getElementById('productActive').checked
        };
        
        // Calcular estado basado en stock
        productData.status = getStockStatus(productData.stock, productData.minStock);
        
        if (currentProductId) {
            // Actualizar producto existente
            const index = productsData.findIndex(p => p.id === currentProductId);
            if (index !== -1) {
                productsData[index] = productData;
            }
        } else {
            // Agregar nuevo producto
            productsData.push(productData);
        }
        
        renderProductsTable(getFilteredProducts());
        closeAllModals();
        showNotification(currentProductId ? 'Producto actualizado correctamente' : 'Producto agregado correctamente', 'success');
    }
    
    function deleteProduct() {
        const index = productsData.findIndex(p => p.id === currentProductId);
        if (index !== -1) {
            productsData.splice(index, 1);
            selectedProducts.delete(currentProductId);
            renderProductsTable(getFilteredProducts());
            closeAllModals();
            showNotification('Producto eliminado correctamente', 'success');
        }
    }
    
    function applyBulkUpdate() {
        if (selectedProducts.size === 0) return;
        
        const action = bulkActionSelect.value;
        const value = bulkActionValue.value;
        
        // Aplicar cambios a productos seleccionados
        productsData.forEach(product => {
            if (selectedProducts.has(product.id)) {
                switch (action) {
                    case 'price-increase':
                        const increasePercent = parseFloat(value);
                        if (!isNaN(increasePercent)) {
                            product.price *= (1 + increasePercent / 100);
                            product.salePrice *= (1 + increasePercent / 100);
                        }
                        break;
                    case 'price-decrease':
                        const decreasePercent = parseFloat(value);
                        if (!isNaN(decreasePercent)) {
                            product.price *= (1 - decreasePercent / 100);
                            product.salePrice *= (1 - decreasePercent / 100);
                        }
                        break;
                    case 'update-category':
                        product.category = value;
                        break;
                    case 'update-supplier':
                        product.supplier = value;
                        break;
                    case 'update-status':
                        // Aquí podrías implementar lógica para cambiar el estado
                        break;
                }
                
                // Recalcular estado después de actualizaciones
                product.status = getStockStatus(product.stock, product.minStock);
            }
        });
        
        // Limpiar selección
        selectedProducts.clear();
        selectAllCheckbox.checked = false;
        
        renderProductsTable(getFilteredProducts());
        closeAllModals();
        showNotification('Actualización masiva aplicada correctamente', 'success');
    }
    
    function showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#2ecc71' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 400px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        const notificationStyle = document.createElement('style');
        notificationStyle.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            .notification-close:hover {
                background-color: rgba(255,255,255,0.2);
            }
        `;
        
        document.head.appendChild(notificationStyle);
        document.body.appendChild(notification);
        
        // Botón para cerrar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Event Listeners
    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    addProductBtn.addEventListener('click', openAddProductModal);
    
    closeProductModal.addEventListener('click', closeAllModals);
    cancelProductBtn.addEventListener('click', closeAllModals);
    saveProductBtn.addEventListener('click', saveProduct);
    
    closeConfirmModal.addEventListener('click', closeAllModals);
    cancelDeleteBtn.addEventListener('click', closeAllModals);
    confirmDeleteBtn.addEventListener('click', deleteProduct);
    
    closeBulkModal.addEventListener('click', closeAllModals);
    cancelBulkBtn.addEventListener('click', closeAllModals);
    applyBulkBtn.addEventListener('click', applyBulkUpdate);
    
    bulkUpdateBtn.addEventListener('click', openBulkUpdateModal);
    
    // Filtros y búsqueda
    searchInput.addEventListener('input', () => {
        currentPage = 1;
        renderProductsTable(getFilteredProducts());
    });
    
    categoryFilter.addEventListener('change', () => {
        currentPage = 1;
        renderProductsTable(getFilteredProducts());
    });
    
    statusFilter.addEventListener('change', () => {
        currentPage = 1;
        renderProductsTable(getFilteredProducts());
    });
    
    // Seleccionar todos los productos
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        const currentPageProducts = getFilteredProducts().slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
        
        if (this.checked) {
            currentPageProducts.forEach(product => {
                selectedProducts.add(product.id);
            });
        } else {
            currentPageProducts.forEach(product => {
                selectedProducts.delete(product.id);
            });
        }
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        
        updateSelectedCount();
    });
    
    // ============================================
    // NUEVO CÓDIGO PARA EXPORTACIÓN A EXCEL PERFECTA
    // ============================================
    
    // Exportar datos
    exportBtn.addEventListener('click', () => {
        const filteredProducts = getFilteredProducts();
        
        if (filteredProducts.length === 0) {
            showNotification('No hay datos para exportar', 'info');
            return;
        }
        
        showNotification('Generando archivo...', 'info');
        
        // Usar método simple que siempre funciona
        exportToExcelNative(filteredProducts);
    });
    
    // Función para formatear fecha actual
    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}`;
    }
    
    // Método NATIVO para exportar a Excel (HTML Table)
    function exportToExcelNative(products) {
        try {
            // Crear tabla HTML temporal
            const table = document.createElement('table');
            table.style.borderCollapse = 'collapse';
            table.style.width = '100%';
            
            // Crear encabezados
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headerRow.style.backgroundColor = '#4CAF50';
            headerRow.style.color = 'white';
            
            const headers = [
                'Nombre', 'Código', 'Categoría', 'Precio Compra', 
                'Precio Venta', 'Stock', 'Stock Mínimo', 'Stock Máximo', 
                'Estado', 'Proveedor', 'Descripción'
            ];
            
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                th.style.border = '1px solid #ddd';
                th.style.padding = '8px';
                th.style.textAlign = 'left';
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // Crear cuerpo de la tabla
            const tbody = document.createElement('tbody');
            
            products.forEach(product => {
                const row = document.createElement('tr');
                
                const cells = [
                    product.name,
                    product.code,
                    product.category.charAt(0).toUpperCase() + product.category.slice(1),
                    `$${product.price.toFixed(2)}`,
                    `$${product.salePrice.toFixed(2)}`,
                    product.stock,
                    product.minStock,
                    product.maxStock,
                    getStatusText(getStockStatus(product.stock, product.minStock)),
                    product.supplier,
                    product.description
                ];
                
                cells.forEach(cellText => {
                    const td = document.createElement('td');
                    td.textContent = cellText;
                    td.style.border = '1px solid #ddd';
                    td.style.padding = '8px';
                    row.appendChild(td);
                });
                
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            
            // Formatear fecha para mostrar en el documento
            const fechaExportacion = new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Crear documento HTML con la tabla
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Inventario Exportado</title>
                <style>
                    * {
                        font-family: Arial, sans-serif;
                    }
                    h1 {
                        color: #2c3e50;
                        margin-bottom: 5px;
                    }
                    .info {
                        color: #7f8c8d;
                        margin-bottom: 20px;
                        font-size: 14px;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin-top: 20px;
                    }
                    th {
                        background-color: #4CAF50;
                        color: white;
                        border: 1px solid #ddd;
                        padding: 10px 8px;
                        text-align: left;
                        font-weight: bold;
                    }
                    td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        vertical-align: top;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    tr:hover {
                        background-color: #f5f5f5;
                    }
                    .total {
                        font-weight: bold;
                        color: #2c3e50;
                        margin-top: 20px;
                        padding: 10px;
                        background-color: #ecf0f1;
                        border-radius: 4px;
                    }
                </style>
            </head>
            <body>
                <h1>Inventario - Gestor Comercial</h1>
                <div class="info">
                    <div>Fecha de exportación: ${fechaExportacion}</div>
                    <div>Total de productos exportados: ${products.length}</div>
                </div>
                ${table.outerHTML}
                <div class="total">
                    Resumen: ${products.length} productos exportados correctamente
                </div>
            </body>
            </html>
            `;
            
            // Crear blob y descargar
            const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Inventario_${getCurrentDateTime()}.xls`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showNotification(`Archivo Excel generado con ${products.length} productos`, 'success');
            
        } catch (error) {
            console.error('Error al exportar:', error);
            showNotification('Error al generar el archivo', 'info');
        }
    }
    
    // ============================================
    // FIN DEL NUEVO CÓDIGO PARA EXPORTACIÓN
    // ============================================
    
    // Eventos para el modal de actualización masiva
    bulkActionSelect.addEventListener('change', function() {
        const action = this.value;
        bulkActionDetails.style.display = action ? 'block' : 'none';
        
        let label = '';
        let placeholder = '';
        
        switch (action) {
            case 'price-increase':
                label = 'Porcentaje de aumento (%)';
                placeholder = 'Ej: 10';
                break;
            case 'price-decrease':
                label = 'Porcentaje de reducción (%)';
                placeholder = 'Ej: 15';
                break;
            case 'update-category':
                label = 'Nueva categoría';
                placeholder = 'Ej: electronica';
                break;
            case 'update-supplier':
                label = 'Nuevo proveedor';
                placeholder = 'Ej: Proveedor Nuevo';
                break;
            case 'update-status':
                label = 'Nuevo estado';
                placeholder = 'in-stock, low-stock, out-of-stock';
                break;
        }
        
        document.getElementById('bulkActionLabel').textContent = label;
        bulkActionValue.placeholder = placeholder;
        bulkActionValue.value = '';
        
        updateSelectedCount();
    });
    
    bulkActionValue.addEventListener('input', updateSelectedCount);
    
    // Eventos para upload de imágenes
    const imageUploadArea = document.getElementById('imageUploadArea');
    const productImageInput = document.getElementById('productImage');
    
    if (imageUploadArea && productImageInput) {
        imageUploadArea.addEventListener('click', () => {
            productImageInput.click();
        });
        
        imageUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadArea.style.borderColor = 'var(--inventory-secondary)';
            imageUploadArea.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
        });
        
        imageUploadArea.addEventListener('dragleave', () => {
            imageUploadArea.style.borderColor = '#ddd';
            imageUploadArea.style.backgroundColor = '';
        });
        
        imageUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadArea.style.borderColor = '#ddd';
            imageUploadArea.style.backgroundColor = '';
            
            if (e.dataTransfer.files.length) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('image/')) {
                    productImageInput.files = e.dataTransfer.files;
                    showNotification('Imagen cargada correctamente', 'success');
                } else {
                    showNotification('Por favor, seleccione un archivo de imagen válido', 'info');
                }
            }
        });
    }
    
    // Cerrar modales al hacer clic fuera de ellos
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // Inicializar la tabla
    renderProductsTable();
    
    // Cerrar sidebar al hacer clic fuera en dispositivos móviles
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && !toggleSidebarBtn.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Manejar tecla Escape para cerrar modales
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
});