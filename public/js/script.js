document.addEventListener('DOMContentLoaded', function() {
    const productManager = new ProductManager();
    
    loadProductsTable();
    
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    toggleSidebarBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(event.target) && !toggleSidebarBtn.contains(event.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    const excelModal = document.getElementById('excelModal');
    const excelUploadBtn = document.getElementById('excelUploadBtn');
    const closeExcelModal = document.getElementById('closeExcelModal');
    const cancelExcelBtn = document.getElementById('cancelExcelBtn');
    const excelDropArea = document.getElementById('excelDropArea');
    const excelFileInput = document.getElementById('excelFileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const importExcelBtn = document.getElementById('importExcelBtn');
    const importProgress = document.getElementById('importProgress');
    const importStatus = document.getElementById('importStatus');
    
    excelUploadBtn.addEventListener('click', function() {
        excelModal.classList.add('active');
    });
    
    closeExcelModal.addEventListener('click', function() {
        excelModal.classList.remove('active');
        resetExcelModal();
    });
    
    cancelExcelBtn.addEventListener('click', function() {
        excelModal.classList.remove('active');
        resetExcelModal();
    });
    
    excelDropArea.addEventListener('click', function() {
        excelFileInput.click();
    });
    
    excelDropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        excelDropArea.style.borderColor = 'var(--secondary-color)';
        excelDropArea.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
    });
    
    excelDropArea.addEventListener('dragleave', function() {
        excelDropArea.style.borderColor = '#ddd';
        excelDropArea.style.backgroundColor = '#f9f9f9';
    });
    
    excelDropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        excelDropArea.style.borderColor = '#ddd';
        excelDropArea.style.backgroundColor = '#f9f9f9';
        
        if (e.dataTransfer.files.length) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });
    
    excelFileInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFileSelection(this.files[0]);
        }
    });
    
    function handleFileSelection(file) {
        const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
            alert('Por favor, seleccione un archivo Excel o CSV válido.');
            return;
        }
        
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.style.display = 'block';
        importExcelBtn.disabled = false;
        
        excelDropArea.style.borderColor = 'var(--success-color)';
        excelDropArea.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    removeFileBtn.addEventListener('click', function() {
        excelFileInput.value = '';
        fileInfo.style.display = 'none';
        importExcelBtn.disabled = true;
        excelDropArea.style.borderColor = '#ddd';
        excelDropArea.style.backgroundColor = '#f9f9f9';
    });
    
    importExcelBtn.addEventListener('click', function() {
        importExcelBtn.disabled = true;
        importExcelBtn.innerHTML = '<span class="spinner"></span> Importando...';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            importProgress.style.width = `${progress}%`;
            
            if (progress <= 30) {
                importStatus.textContent = 'Leyendo archivo Excel...';
            } else if (progress <= 60) {
                importStatus.textContent = 'Validando datos...';
            } else if (progress <= 90) {
                importStatus.textContent = 'Actualizando base de datos...';
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                importStatus.innerHTML = '<span style="color: var(--success-color);"><i class="fas fa-check-circle"></i> ¡Importación completada con éxito!</span>';
                importExcelBtn.textContent = 'Completado';
                importExcelBtn.style.backgroundColor = 'var(--success-color)';
                
                setTimeout(() => {
                    const importedProducts = [
                        { name: "Nuevo Producto Importado 1", category: "Importados", price: 12.99, stock: 25, supplier: "Nuevo Proveedor" },
                        { name: "Nuevo Producto Importado 2", category: "Importados", price: 8.50, stock: 30, supplier: "Nuevo Proveedor" },
                        { name: "Aceite Vegetal 1L", category: "Alimentos", price: 4.10, stock: 30, supplier: "Mayorista Central" },
                        { name: "Detergente Líquido 2L", category: "Limpieza", price: 5.50, stock: 20, supplier: "Importadora del Norte" }
                    ];
                    
                    const result = productManager.importProducts(importedProducts, {
                        updateExisting: document.getElementById('updateExisting').checked,
                        addNew: document.getElementById('addNewProducts').checked
                    });
                    
                    loadProductsTable();
                    
                    excelModal.classList.remove('active');
                    resetExcelModal();
                    alert(`Importación completada: ${result.imported} nuevos productos, ${result.updated} actualizados.`);
                }, 500);
            }
        }, 300);
    });
    
    function resetExcelModal() {
        excelFileInput.value = '';
        fileInfo.style.display = 'none';
        importExcelBtn.disabled = true;
        importExcelBtn.innerHTML = 'Importar Productos';
        importExcelBtn.style.backgroundColor = '';
        importProgress.style.width = '0%';
        importStatus.textContent = '';
        excelDropArea.style.borderColor = '#ddd';
        excelDropArea.style.backgroundColor = '#f9f9f9';
    }
    
    const scrapingModal = document.getElementById('scrapingModal');
    const webScrapingBtn = document.getElementById('webScrapingBtn');
    const closeScrapingModal = document.getElementById('closeScrapingModal');
    const cancelScrapingBtn = document.getElementById('cancelScrapingBtn');
    const startScrapingBtn = document.getElementById('startScrapingBtn');
    const providerSelect = document.getElementById('providerSelect');
    const providerUrl = document.getElementById('providerUrl');
    const statusText = document.getElementById('statusText');
    const progressDetails = document.getElementById('progressDetails');
    
    webScrapingBtn.addEventListener('click', function() {
        scrapingModal.classList.add('active');
    });
    
    closeScrapingModal.addEventListener('click', function() {
        scrapingModal.classList.remove('active');
        resetScrapingModal();
    });
    
    cancelScrapingBtn.addEventListener('click', function() {
        scrapingModal.classList.remove('active');
        resetScrapingModal();
    });
    
    providerSelect.addEventListener('change', function() {
        const providerUrls = {
            '1': 'https://distribuidora-martinez.com/catalogo',
            '2': 'https://mayoristacentral.com.ar/productos',
            '3': 'https://importadoranorte.com.uy/stock',
            '4': ''
        };
        
        if (this.value && providerUrls[this.value]) {
            providerUrl.value = providerUrls[this.value];
        } else if (this.value === '4') {
            providerUrl.value = '';
            providerUrl.focus();
        }
    });
    
    startScrapingBtn.addEventListener('click', function() {
        if (!providerUrl.value) {
            alert('Por favor, ingrese la URL del proveedor.');
            providerUrl.focus();
            return;
        }
        
        startScrapingBtn.disabled = true;
        startScrapingBtn.innerHTML = '<span class="spinner"></span> Procesando...';
        statusText.innerHTML = '<span style="color: var(--warning-color);"><i class="fas fa-sync-alt fa-spin"></i> Conectando con el proveedor...</span>';
        
        let step = 1;
        const steps = [
            "Conectando con el sitio web...",
            "Extrayendo datos de productos...",
            "Obteniendo precios actualizados...",
            "Verificando nuevos productos...",
            "Actualizando base de datos local..."
        ];
        
        progressDetails.innerHTML = `<div>Paso ${step} de ${steps.length}: ${steps[0]}</div>`;
        
        const interval = setInterval(() => {
            if (step <= steps.length) {
                statusText.innerHTML = `<span style="color: var(--warning-color);"><i class="fas fa-sync-alt fa-spin"></i> ${steps[step-1]}</span>`;
                progressDetails.innerHTML = `<div>Paso ${step} de ${steps.length}: ${steps[step-1]}</div>`;
                step++;
            }
            
            if (step > steps.length) {
                clearInterval(interval);
                statusText.innerHTML = '<span style="color: var(--success-color);"><i class="fas fa-check-circle"></i> ¡Actualización completada con éxito!</span>';
                progressDetails.innerHTML = '<div>Se actualizaron 42 precios y se agregaron 7 nuevos productos.</div>';
                startScrapingBtn.innerHTML = 'Completado';
                startScrapingBtn.style.backgroundColor = 'var(--success-color)';
                
                setTimeout(() => {
                    const products = productManager.getAllProducts();
                    const updatedProducts = products.map(product => {
                        if (Math.random() > 0.5) {
                            const priceChange = 0.9 + Math.random() * 0.2;
                            return {
                                ...product,
                                price: parseFloat((product.price * priceChange).toFixed(2)),
                                stock: Math.max(0, product.stock + Math.floor(Math.random() * 10) - 5)
                            };
                        }
                        return product;
                    });
                    
                    updatedProducts.forEach((product, index) => {
                        productManager.updateProduct(product.id, {
                            price: product.price,
                            stock: product.stock,
                            status: productManager.calculateStatus(product.stock)
                        });
                    });
                    
                    const newProducts = [
                        { name: "Producto desde Web 1", category: "Web", price: 15.99, stock: 18, supplier: "Proveedor Web" },
                        { name: "Producto desde Web 2", category: "Web", price: 22.50, stock: 5, supplier: "Proveedor Web" }
                    ];
                    
                    newProducts.forEach(product => {
                        productManager.addProduct(product);
                    });
                    
                    loadProductsTable();
                    
                    setTimeout(() => {
                        scrapingModal.classList.remove('active');
                        resetScrapingModal();
                        alert('Actualización desde proveedor completada. Se actualizaron precios y se agregaron nuevos productos.');
                    }, 1000);
                }, 500);
            }
        }, 1500);
    });
    
    function resetScrapingModal() {
        providerSelect.value = '';
        providerUrl.value = '';
        document.getElementById('providerUser').value = '';
        document.getElementById('providerPass').value = '';
        document.getElementById('updatePrices').checked = true;
        document.getElementById('updateProducts').checked = true;
        document.getElementById('updateStock').checked = false;
        statusText.textContent = 'Esperando configuración...';
        progressDetails.innerHTML = '';
        startScrapingBtn.disabled = false;
        startScrapingBtn.innerHTML = 'Iniciar Actualización';
        startScrapingBtn.style.backgroundColor = '';
    }
    
    function loadProductsTable() {
        const productTableBody = document.getElementById('productTableBody');
        productTableBody.innerHTML = '';
        
        const products = productManager.getAllProducts();
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.dataset.productId = product.id;
            
            let statusText = '';
            let statusClass = '';
            
            switch(product.status) {
                case 'in-stock':
                    statusText = 'En Stock';
                    statusClass = 'in-stock';
                    break;
                case 'low-stock':
                    statusText = 'Stock Bajo';
                    statusClass = 'low-stock';
                    break;
                case 'out-of-stock':
                    statusText = 'Sin Stock';
                    statusClass = 'out-of-stock';
                    break;
            }
            
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center;">
                        <div class="product-image">
                            <i class="fas fa-box"></i>
                        </div>
                        <div style="margin-left: 10px;">
                            <div style="font-weight: bold;">${product.name}</div>
                            <div style="font-size: 0.8rem; color: #7f8c8d;">SKU: ${product.sku}</div>
                        </div>
                    </div>
                </td>
                <td>${product.category}</td>
                <td style="font-weight: bold;">$${product.price.toFixed(2)}</td>
                <td>${product.stock} unidades</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>${product.supplier}</td>
            `;
            
            productTableBody.appendChild(row);
        });
        
        updateDashboardCounters();
    }
    
    function updateDashboardCounters() {
        const products = productManager.getAllProducts();
        const productsCount = products.length;
        
        const productCountElement = document.querySelector('.dashboard-cards .card:nth-child(1) .card-value');
        if (productCountElement) {
            productCountElement.textContent = productsCount.toLocaleString();
        }
    }
    
    window.addManualProduct = function(productData) {
        const defaultProduct = {
            name: "Nuevo Producto Manual",
            category: "General",
            price: 10.99,
            stock: 50,
            supplier: "Proveedor Manual"
        };
        
        const newProduct = productData || defaultProduct;
        productManager.addProduct(newProduct);
        loadProductsTable();
        alert('Producto agregado exitosamente');
        return newProduct;
    };
    
    window.testAddProduct = function() {
        const testProduct = {
            name: "Producto de Prueba",
            category: "Pruebas",
            price: 9.99,
            stock: 100,
            supplier: "Proveedor de Pruebas"
        };
        
        return addManualProduct(testProduct);
    };
    
    updateDashboardCounters();
});
