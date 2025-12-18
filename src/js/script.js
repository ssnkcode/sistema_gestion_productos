// Datos de ejemplo para productos
const sampleProducts = [
    { name: "Arroz Premium 1kg", category: "Alimentos", price: "$2.50", stock: 45, status: "in-stock", supplier: "Distribuidora Martínez" },
    { name: "Aceite Vegetal 1L", category: "Alimentos", price: "$3.80", stock: 22, status: "in-stock", supplier: "Mayorista Central" },
    { name: "Detergente Líquido 2L", category: "Limpieza", price: "$5.20", stock: 15, status: "low-stock", supplier: "Importadora del Norte" },
    { name: "Café Molido 500g", category: "Alimentos", price: "$7.50", stock: 8, status: "low-stock", supplier: "Distribuidora Martínez" },
    { name: "Papel Higiénico 12 rollos", category: "Hogar", price: "$4.30", stock: 0, status: "out-of-stock", supplier: "Mayorista Central" },
    { name: "Leche Entera 1L", category: "Lácteos", price: "$1.20", stock: 32, status: "in-stock", supplier: "Distribuidora Martínez" },
    { name: "Galletas de Chocolate", category: "Snacks", price: "$2.10", stock: 28, status: "in-stock", supplier: "Importadora del Norte" },
    { name: "Shampoo Anticaspa 400ml", category: "Cuidado Personal", price: "$6.40", stock: 12, status: "low-stock", supplier: "Mayorista Central" }
];

// Inicializar la tabla de productos
document.addEventListener('DOMContentLoaded', function() {
    const productTableBody = document.getElementById('productTableBody');
    
    sampleProducts.forEach(product => {
        const row = document.createElement('tr');
        
        // Determinar el texto del estado
        let statusText = '';
        if (product.status === 'in-stock') statusText = 'En Stock';
        else if (product.status === 'low-stock') statusText = 'Stock Bajo';
        else statusText = 'Sin Stock';
        
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center;">
                    <div class="product-image">
                        <i class="fas fa-box"></i>
                    </div>
                    <div style="margin-left: 10px;">
                        <div style="font-weight: bold;">${product.name}</div>
                        <div style="font-size: 0.8rem; color: #7f8c8d;">SKU: ${Math.floor(10000 + Math.random() * 90000)}</div>
                    </div>
                </div>
            </td>
            <td>${product.category}</td>
            <td style="font-weight: bold;">${product.price}</td>
            <td>${product.stock} unidades</td>
            <td><span class="status ${product.status}">${statusText}</span></td>
            <td>${product.supplier}</td>
        `;
        
        productTableBody.appendChild(row);
    });
    
    // Manejar la barra lateral en dispositivos móviles
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    toggleSidebarBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Cerrar sidebar al hacer clic fuera en móviles
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(event.target) && !toggleSidebarBtn.contains(event.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Modal de carga de Excel
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
    
    // Abrir modal de Excel
    excelUploadBtn.addEventListener('click', function() {
        excelModal.classList.add('active');
    });
    
    // Cerrar modal de Excel
    closeExcelModal.addEventListener('click', function() {
        excelModal.classList.remove('active');
        resetExcelModal();
    });
    
    cancelExcelBtn.addEventListener('click', function() {
        excelModal.classList.remove('active');
        resetExcelModal();
    });
    
    // Manejar arrastrar y soltar archivos
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
    
    // Manejar selección de archivo
    excelFileInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFileSelection(this.files[0]);
        }
    });
    
    function handleFileSelection(file) {
        // Validar tipo de archivo
        const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
            alert('Por favor, seleccione un archivo Excel o CSV válido.');
            return;
        }
        
        // Mostrar información del archivo
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.style.display = 'block';
        importExcelBtn.disabled = false;
        
        // Resaltar área de drop
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
    
    // Eliminar archivo seleccionado
    removeFileBtn.addEventListener('click', function() {
        excelFileInput.value = '';
        fileInfo.style.display = 'none';
        importExcelBtn.disabled = true;
        excelDropArea.style.borderColor = '#ddd';
        excelDropArea.style.backgroundColor = '#f9f9f9';
    });
    
    // Simular importación de Excel
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
                importStatus.textContent = '¡Importación completada con éxito!';
                importExcelBtn.textContent = 'Completado';
                importExcelBtn.style.backgroundColor = 'var(--success-color)';
                
                // Simular actualización de la tabla
                setTimeout(() => {
                    addNewProductFromImport();
                    setTimeout(() => {
                        excelModal.classList.remove('active');
                        resetExcelModal();
                        alert('Se han importado 15 productos correctamente.');
                    }, 1000);
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
    
    // Modal de web scraping
    const scrapingModal = document.getElementById('scrapingModal');
    const webScrapingBtn = document.getElementById('webScrapingBtn');
    const closeScrapingModal = document.getElementById('closeScrapingModal');
    const cancelScrapingBtn = document.getElementById('cancelScrapingBtn');
    const startScrapingBtn = document.getElementById('startScrapingBtn');
    const providerSelect = document.getElementById('providerSelect');
    const providerUrl = document.getElementById('providerUrl');
    const statusText = document.getElementById('statusText');
    const progressDetails = document.getElementById('progressDetails');
    
    // Abrir modal de web scraping
    webScrapingBtn.addEventListener('click', function() {
        scrapingModal.classList.add('active');
    });
    
    // Cerrar modal de web scraping
    closeScrapingModal.addEventListener('click', function() {
        scrapingModal.classList.remove('active');
        resetScrapingModal();
    });
    
    cancelScrapingBtn.addEventListener('click', function() {
        scrapingModal.classList.remove('active');
        resetScrapingModal();
    });
    
    // Cambiar URL según proveedor seleccionado
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
    
    // Simular web scraping
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
                
                // Simular actualización de la tabla
                setTimeout(() => {
                    updateProductPrices();
                    setTimeout(() => {
                        scrapingModal.classList.remove('active');
                        resetScrapingModal();
                        alert('Actualización desde proveedor completada. Se actualizaron 42 precios y se agregaron 7 nuevos productos.');
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
    
    // Funciones para simular cambios en la interfaz
    function addNewProductFromImport() {
        const newProduct = {
            name: "Nuevo Producto Importado",
            category: "Importados",
            price: "$12.99",
            stock: 25,
            status: "in-stock",
            supplier: "Nuevo Proveedor"
        };
        
        const productTableBody = document.getElementById('productTableBody');
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center;">
                    <div class="product-image">
                        <i class="fas fa-box"></i>
                    </div>
                    <div style="margin-left: 10px;">
                        <div style="font-weight: bold;">${newProduct.name}</div>
                        <div style="font-size: 0.8rem; color: #7f8c8d;">SKU: IMPORT-${Math.floor(100 + Math.random() * 900)}</div>
                    </div>
                </div>
            </td>
            <td>${newProduct.category}</td>
            <td style="font-weight: bold;">${newProduct.price}</td>
            <td>${newProduct.stock} unidades</td>
            <td><span class="status ${newProduct.status}">En Stock</span></td>
            <td>${newProduct.supplier}</td>
        `;
        
        // Insertar al principio de la tabla
        productTableBody.insertBefore(row, productTableBody.firstChild);
    }
    
    function updateProductPrices() {
        const priceCells = document.querySelectorAll('.table td:nth-child(3)');
        priceCells.forEach(cell => {
            if (Math.random() > 0.7) { // 30% de probabilidad de cambio
                const currentPrice = parseFloat(cell.textContent.replace('$', ''));
                const newPrice = (currentPrice * (0.9 + Math.random() * 0.2)).toFixed(2);
                cell.textContent = `$${newPrice}`;
                cell.style.color = 'var(--accent-color)';
                cell.style.fontWeight = 'bold';
                
                // Quitar el resaltado después de 2 segundos
                setTimeout(() => {
                    cell.style.color = '';
                }, 2000);
            }
        });
    }
});