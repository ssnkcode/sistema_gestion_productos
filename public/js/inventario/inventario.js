document.addEventListener('DOMContentLoaded', async function() {
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
    
    let currentProductId = null;
    let selectedProducts = new Set();
    let productsData = [];
    let currentPage = 1;
    const itemsPerPage = 15;
    
    const productManager = new ProductManager();

    async function initInventory() {
        await loadProductsData();
        renderProductsTable();
    }

    async function loadProductsData() {
        try {
            productsData = await productManager.getAllProducts();
        } catch (error) {
            console.error('Error cargando productos:', error);
            showNotification('Error al cargar inventario', 'error');
            productsData = [];
        }
    }
    
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    function getStatusText(status) {
        const statusMap = {
            'in-stock': 'En Stock',
            'low-stock': 'Stock Bajo',
            'out-of-stock': 'Agotado'
        };
        return statusMap[status] || status;
    }
    
    function renderProductsTable(products = getFilteredProducts()) {
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
                            No se encontraron productos
                        </div>
                    </td>
                </tr>
            `;
            updatePaginationInfo(0);
            return;
        }
        
        paginatedProducts.forEach(product => {
            const isSelected = selectedProducts.has(product._id);
            const statusText = getStatusText(product.status);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="product-checkbox" data-id="${product._id}" ${isSelected ? 'checked' : ''}>
                </td>
                <td>
                    <div class="product-cell">
                        <div class="product-image-small">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <div class="product-description">${product.description || ''}</div>
                        </div>
                    </div>
                </td>
                <td>${product.code}</td>
                <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
                <td>${formatCurrency(product.salePrice)}</td>
                <td>${product.stock}</td>
                <td>
                    <span class="stock-status ${product.status}">${statusText}</span>
                </td>
                <td>${product.supplier}</td>
                <td>
                    <div class="table-actions">
                        <div class="action-icon edit" title="Editar" data-id="${product._id}">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="action-icon delete" title="Eliminar" data-id="${product._id}">
                            <i class="fas fa-trash"></i>
                        </div>
                    </div>
                </td>
            `;
            inventoryTableBody.appendChild(row);
        });
        
        updatePaginationInfo(products.length);
        attachTableEvents();
    }
    
    function updatePaginationInfo(totalProducts) {
        const pageInfo = document.querySelector('.page-info');
        const startItem = totalProducts === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalProducts);
        
        if (pageInfo) {
            pageInfo.textContent = `Mostrando ${startItem}-${endItem} de ${totalProducts} productos`;
        }
        
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        updatePageNumbers(totalPages);
    }
    
    function updatePageNumbers(totalPages) {
        const pageNumbersContainer = document.querySelector('.page-numbers');
        if (!pageNumbersContainer) return;
        
        pageNumbersContainer.innerHTML = '';
        
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
                renderProductsTable();
            });
            pageNumbersContainer.appendChild(pageNumber);
        }
        
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        
        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage === 1 || totalPages === 0;
            prevPageBtn.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderProductsTable();
                }
            };
        }
        
        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
            nextPageBtn.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderProductsTable();
                }
            };
        }
    }
    
    function getFilteredProducts() {
        let filtered = [...productsData];
        
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.code.toLowerCase().includes(searchTerm) ||
                (product.description && product.description.toLowerCase().includes(searchTerm))
            );
        }
        
        const category = categoryFilter.value;
        if (category) {
            filtered = filtered.filter(product => product.category === category);
        }
        
        const status = statusFilter.value;
        if (status) {
            filtered = filtered.filter(product => product.status === status);
        }
        
        return filtered;
    }
    
    function attachTableEvents() {
        document.querySelectorAll('.product-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const productId = this.getAttribute('data-id');
                
                if (this.checked) {
                    selectedProducts.add(productId);
                } else {
                    selectedProducts.delete(productId);
                    selectAllCheckbox.checked = false;
                }
                
                updateSelectedCount();
            });
        });
        
        document.querySelectorAll('.action-icon.edit').forEach(btn => {
            btn.addEventListener('click', async function() {
                const productId = this.getAttribute('data-id');
                await openEditProductModal(productId);
            });
        });
        
        document.querySelectorAll('.action-icon.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const product = productsData.find(p => p._id === productId);
                if (product) {
                    openConfirmDeleteModal(product);
                }
            });
        });
    }
    
    function updateSelectedCount() {
        selectedCount.textContent = selectedProducts.size;
        selectedProductsList.innerHTML = '';
        selectedProducts.forEach(id => {
            const product = productsData.find(p => p._id === id);
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
        applyBulkBtn.disabled = selectedProducts.size === 0 || !bulkActionSelect.value;
    }
    
    function openAddProductModal() {
        currentProductId = null;
        document.getElementById('modalTitle').textContent = 'Agregar Nuevo Producto';
        productForm.reset();
        productModal.classList.add('active');
    }
    
    async function openEditProductModal(productId) {
        const product = await productManager.getProductById(productId);
        if (!product) return;
        
        currentProductId = productId;
        document.getElementById('modalTitle').textContent = 'Editar Producto';
        
        document.getElementById('productName').value = product.name;
        document.getElementById('productCode').value = product.code;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productSupplier').value = product.supplier;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productSalePrice').value = product.salePrice;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productMinStock').value = product.minStock;
        document.getElementById('productMaxStock').value = product.maxStock;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productActive').checked = product.active;
        
        productModal.classList.add('active');
    }
    
    function openConfirmDeleteModal(product) {
        document.getElementById('productToDeleteName').textContent = `${product.name} (${product.code})`;
        confirmDeleteModal.classList.add('active');
        currentProductId = product._id;
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
    
    async function saveProduct() {
        if (!productForm.checkValidity()) {
            productForm.reportValidity();
            return;
        }
        
        saveProductBtn.disabled = true;
        saveProductBtn.textContent = 'Guardando...';

        const productData = {
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
        
        try {
            if (currentProductId) {
                await productManager.updateProduct(currentProductId, productData);
                showNotification('Producto actualizado correctamente', 'success');
            } else {
                await productManager.addProduct(productData);
                showNotification('Producto agregado correctamente', 'success');
            }
            
            await loadProductsData();
            renderProductsTable();
            closeAllModals();
        } catch (error) {
            console.error('Error al guardar:', error);
            showNotification(error.message, 'error');
        } finally {
            saveProductBtn.disabled = false;
            saveProductBtn.textContent = 'Guardar Producto';
        }
    }
    
    async function deleteProduct() {
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.textContent = 'Eliminando...';
        
        try {
            const success = await productManager.deleteProduct(currentProductId);
            
            if (success) {
                selectedProducts.delete(currentProductId);
                await loadProductsData();
                renderProductsTable();
                closeAllModals();
                showNotification('Producto eliminado correctamente', 'success');
            } else {
                showNotification('Error al eliminar producto', 'error');
            }
        } catch (error) {
            console.error('Error eliminando:', error);
            showNotification('Error al procesar la solicitud', 'error');
        } finally {
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.textContent = 'Eliminar Producto';
        }
    }
    
    async function applyBulkUpdate() {
        if (selectedProducts.size === 0) return;
        
        applyBulkBtn.disabled = true;
        applyBulkBtn.textContent = 'Aplicando...';
        
        const action = bulkActionSelect.value;
        const value = bulkActionValue.value;
        const ids = Array.from(selectedProducts);
        let updateData = {};

        switch (action) {
            case 'price-increase':
            case 'price-decrease':
                showNotification('Actualización masiva de precios por porcentaje no soportada en API básica aún.', 'info');
                applyBulkBtn.disabled = false;
                applyBulkBtn.textContent = 'Aplicar Cambios';
                return;
            case 'update-category':
                updateData.category = value;
                break;
            case 'update-supplier':
                updateData.supplier = value;
                break;
            case 'update-status':
                updateData.status = value;
                break;
        }
        
        try {
            const success = await productManager.bulkUpdate(ids, updateData);
            
            if (success) {
                selectedProducts.clear();
                selectAllCheckbox.checked = false;
                await loadProductsData();
                renderProductsTable();
                closeAllModals();
                showNotification('Actualización masiva aplicada correctamente', 'success');
            } else {
                showNotification('Hubo un problema con la actualización masiva', 'error');
            }
        } catch (error) {
            console.error('Error bulk update:', error);
            showNotification('Error de conexión', 'error');
        } finally {
            applyBulkBtn.disabled = false;
            applyBulkBtn.textContent = 'Aplicar Cambios';
        }
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
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
        if (!document.getElementById('notification-style')) {
            notificationStyle.id = 'notification-style';
            notificationStyle.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-content { display: flex; align-items: center; gap: 10px; }
                .notification-close { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; }
            `;
            document.head.appendChild(notificationStyle);
        }
        
        document.body.appendChild(notification);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 5000);
    }
    
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
    
    searchInput.addEventListener('input', () => {
        currentPage = 1;
        renderProductsTable();
    });
    
    categoryFilter.addEventListener('change', () => {
        currentPage = 1;
        renderProductsTable();
    });
    
    statusFilter.addEventListener('change', () => {
        currentPage = 1;
        renderProductsTable();
    });
    
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        const currentPageProducts = getFilteredProducts().slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
        
        if (this.checked) {
            currentPageProducts.forEach(product => {
                selectedProducts.add(product._id);
            });
        } else {
            currentPageProducts.forEach(product => {
                selectedProducts.delete(product._id);
            });
        }
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        
        updateSelectedCount();
    });
    
    exportBtn.addEventListener('click', () => {
        const filteredProducts = getFilteredProducts();
        
        if (filteredProducts.length === 0) {
            showNotification('No hay datos para exportar', 'info');
            return;
        }
        
        showNotification('Generando archivo...', 'info');
        exportToExcelNative(filteredProducts);
    });
    
    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}`;
    }
    
    function exportToExcelNative(products) {
        try {
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            const headers = ['Nombre', 'Código', 'Categoría', 'Precio Venta', 'Stock', 'Estado', 'Proveedor', 'Descripción'];
            
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            const tbody = document.createElement('tbody');
            
            products.forEach(product => {
                const row = document.createElement('tr');
                const cells = [
                    product.name,
                    product.code,
                    product.category,
                    `$${product.salePrice.toFixed(2)}`,
                    product.stock,
                    product.status,
                    product.supplier,
                    product.description || ''
                ];
                
                cells.forEach(cellText => {
                    const td = document.createElement('td');
                    td.textContent = cellText;
                    row.appendChild(td);
                });
                
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            
            const html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                </head>
            <body>
                ${table.outerHTML}
            </body>
            </html>
            `;
            
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
    
    const imageUploadArea = document.getElementById('imageUploadArea');
    const productImageInput = document.getElementById('productImage');
    
    if (imageUploadArea && productImageInput) {
        imageUploadArea.addEventListener('click', () => {
            productImageInput.click();
        });
        
        imageUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadArea.style.borderColor = '#3498db';
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
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && !toggleSidebarBtn.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });

    initInventory();
});