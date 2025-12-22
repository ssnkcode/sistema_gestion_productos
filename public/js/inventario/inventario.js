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
            console.error(error);
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
        if (!inventoryTableBody) return;
        inventoryTableBody.innerHTML = '';
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);
        
        if (paginatedProducts.length === 0) {
            inventoryTableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px;">
                        <div>No se encontraron productos</div>
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
                <td>${product.category}</td>
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
        if(selectedCount) selectedCount.textContent = selectedProducts.size;
        if(selectedProductsList) {
            selectedProductsList.innerHTML = '';
            selectedProducts.forEach(id => {
                const product = productsData.find(p => p._id === id);
                if (product) {
                    const item = document.createElement('div');
                    item.className = 'selected-product-item';
                    item.innerHTML = `<span>${product.name}</span>`;
                    selectedProductsList.appendChild(item);
                }
            });
        }
        if(applyBulkBtn) applyBulkBtn.disabled = selectedProducts.size === 0 || !bulkActionSelect.value;
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
            } else {
                await productManager.addProduct(productData);
            }
            
            await loadProductsData();
            renderProductsTable();
            closeAllModals();
        } catch (error) {
            console.error(error);
        } finally {
            saveProductBtn.disabled = false;
        }
    }
    
    async function deleteProduct() {
        confirmDeleteBtn.disabled = true;
        
        try {
            await productManager.deleteProduct(currentProductId);
            selectedProducts.delete(currentProductId);
            await loadProductsData();
            renderProductsTable();
            closeAllModals();
        } catch (error) {
            console.error(error);
        } finally {
            confirmDeleteBtn.disabled = false;
        }
    }
    
    async function applyBulkUpdate() {
        if (selectedProducts.size === 0) return;
        
        applyBulkBtn.disabled = true;
        
        const action = bulkActionSelect.value;
        const value = bulkActionValue.value;
        const ids = Array.from(selectedProducts);
        let updateData = {};

        if (action === 'update-category') updateData.category = value;
        else if (action === 'update-supplier') updateData.supplier = value;
        else if (action === 'update-status') updateData.status = value;
        
        try {
            await productManager.bulkUpdate(ids, updateData);
            selectedProducts.clear();
            selectAllCheckbox.checked = false;
            await loadProductsData();
            renderProductsTable();
            closeAllModals();
        } catch (error) {
            console.error(error);
        } finally {
            applyBulkBtn.disabled = false;
        }
    }
    
    if(toggleSidebarBtn) toggleSidebarBtn.addEventListener('click', () => sidebar.classList.toggle('active'));
    if(addProductBtn) addProductBtn.addEventListener('click', openAddProductModal);
    if(closeProductModal) closeProductModal.addEventListener('click', closeAllModals);
    if(cancelProductBtn) cancelProductBtn.addEventListener('click', closeAllModals);
    if(saveProductBtn) saveProductBtn.addEventListener('click', saveProduct);
    if(closeConfirmModal) closeConfirmModal.addEventListener('click', closeAllModals);
    if(cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeAllModals);
    if(confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', deleteProduct);
    if(closeBulkModal) closeBulkModal.addEventListener('click', closeAllModals);
    if(cancelBulkBtn) cancelBulkBtn.addEventListener('click', closeAllModals);
    if(applyBulkBtn) applyBulkBtn.addEventListener('click', applyBulkUpdate);
    if(bulkUpdateBtn) bulkUpdateBtn.addEventListener('click', openBulkUpdateModal);
    
    if(searchInput) searchInput.addEventListener('input', () => { currentPage = 1; renderProductsTable(); });
    if(categoryFilter) categoryFilter.addEventListener('change', () => { currentPage = 1; renderProductsTable(); });
    if(statusFilter) statusFilter.addEventListener('change', () => { currentPage = 1; renderProductsTable(); });
    
    if(selectAllCheckbox) selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        const currentPageProducts = getFilteredProducts().slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
        
        if (this.checked) {
            currentPageProducts.forEach(product => selectedProducts.add(product._id));
        } else {
            currentPageProducts.forEach(product => selectedProducts.delete(product._id));
        }
        
        checkboxes.forEach(checkbox => checkbox.checked = this.checked);
        updateSelectedCount();
    });
    
    if(bulkActionSelect) bulkActionSelect.addEventListener('change', function() {
        const action = this.value;
        if(bulkActionDetails) bulkActionDetails.style.display = action ? 'block' : 'none';
        updateSelectedCount();
    });
    
    if(bulkActionValue) bulkActionValue.addEventListener('input', updateSelectedCount);
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAllModals();
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && sidebar) {
            if (!sidebar.contains(e.target) && !toggleSidebarBtn.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });

    initInventory();
});