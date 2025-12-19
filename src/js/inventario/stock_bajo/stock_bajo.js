// Reporte de Stock Bajo - Funcionalidad Completa

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let lowStockProducts = [];
    let filteredProducts = [];
    let selectedProducts = new Set();
    
    // Inicializar la aplicación
    initReport();
    
    // Funciones de inicialización
    function initReport() {
        loadLowStockData();
        setupEventListeners();
        initializeCharts();
    }
    
    // Cargar datos de stock bajo
    function loadLowStockData() {
        // Simular datos de productos con stock bajo
        // En una aplicación real, esto vendría de una API o base de datos
        lowStockProducts = generateMockLowStockData();
        filteredProducts = [...lowStockProducts];
        
        updateReportStats();
        renderProductsTable();
        updateSuppliersList();
        updateCharts();
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Filtros
        document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
        document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
        
        // Selección
        document.getElementById('selectAllReport').addEventListener('change', toggleSelectAllProducts);
        document.getElementById('selectAllProducts').addEventListener('click', selectAllProducts);
        
        // Exportación
        document.getElementById('exportPDFBtn').addEventListener('click', () => exportReport('pdf'));
        document.getElementById('exportExcelBtn').addEventListener('click', () => exportReport('excel'));
        document.getElementById('exportCSVBtn').addEventListener('click', () => exportReport('csv'));
        document.getElementById('exportEmailBtn').addEventListener('click', () => exportReport('email'));
        document.getElementById('exportSelectedBtn').addEventListener('click', exportSelectedProducts);
        document.getElementById('confirmExportBtn').addEventListener('click', confirmExport);
        
        // Reposición
        document.getElementById('restockSelectedBtn').addEventListener('click', openRestockModal);
        document.getElementById('requestRestockBtn').addEventListener('click', openRestockModal);
        document.getElementById('confirmRestockBtn').addEventListener('click', confirmRestock);
        document.getElementById('cancelRestockBtn').addEventListener('click', closeRestockModal);
        
        // Acciones rápidas
        document.getElementById('printReportBtn').addEventListener('click', printReport);
        document.getElementById('generatePurchaseOrderBtn').addEventListener('click', generatePurchaseOrder);
        document.getElementById('sendAlertsBtn').addEventListener('click', sendAlerts);
        document.getElementById('scheduleRestockBtn').addEventListener('click', scheduleRestock);
        document.getElementById('comparePricesBtn').addEventListener('click', comparePrices);
        
        // Cerrar modales
        document.getElementById('closeRestockModal')?.addEventListener('click', closeRestockModal);
        document.getElementById('closeExportModal')?.addEventListener('click', closeExportModal);
        document.getElementById('cancelExportBtn')?.addEventListener('click', closeExportModal);
    }
    
    // Generar datos de prueba
    function generateMockLowStockData() {
        const categories = ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Oficina'];
        const suppliers = ['Distribuidora Martínez', 'Mayorista Central', 'Importadora del Norte', 'Proveedor Externo'];
        
        return Array.from({ length: 25 }, (_, i) => {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const stockCurrent = Math.floor(Math.random() * 10) + 1;
            const stockMin = Math.floor(Math.random() * 10) + 5;
            const price = (Math.random() * 1000 + 10).toFixed(2);
            
            return {
                id: i + 1,
                name: `Producto ${i + 1}`,
                code: `PROD-${1000 + i}`,
                category: category,
                stockCurrent: stockCurrent,
                stockMin: stockMin,
                difference: stockCurrent - stockMin,
                daysLow: Math.floor(Math.random() * 30) + 1,
                price: parseFloat(price),
                valueAtRisk: (stockCurrent * price).toFixed(2),
                supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
                priority: stockCurrent < 3 ? 'critical' : stockCurrent < 6 ? 'high' : 'medium',
                lastRestock: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            };
        });
    }
    
    // Actualizar estadísticas del reporte
    function updateReportStats() {
        const totalLowStock = lowStockProducts.length;
        const totalRiskValue = lowStockProducts.reduce((sum, product) => sum + parseFloat(product.valueAtRisk), 0);
        const avgDaysLow = lowStockProducts.reduce((sum, product) => sum + product.daysLow, 0) / totalLowStock;
        const suppliers = [...new Set(lowStockProducts.map(p => p.supplier))];
        
        document.getElementById('totalLowStock').textContent = totalLowStock;
        document.getElementById('totalRiskValue').textContent = `$${totalRiskValue.toFixed(2)}`;
        document.getElementById('avgRestockTime').textContent = `${avgDaysLow.toFixed(1)} días`;
        document.getElementById('suppliersCount').textContent = suppliers.length;
    }
    
    // Renderizar tabla de productos
    function renderProductsTable() {
        const tbody = document.getElementById('lowStockTableBody');
        tbody.innerHTML = '';
        
        let totalRisk = 0;
        let totalToRestock = 0;
        let estimatedCost = 0;
        
        filteredProducts.forEach(product => {
            const row = document.createElement('tr');
            const priorityClass = `priority-${product.priority}`;
            const rowClass = `${product.priority}-stock-row`;
            const stockDifferenceClass = product.difference < 0 ? 'negative' : '';
            
            row.className = rowClass;
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="product-checkbox" data-id="${product.id}">
                </td>
                <td>${product.name}</td>
                <td>${product.code}</td>
                <td>${product.category}</td>
                <td class="${priorityClass}">${product.stockCurrent}</td>
                <td>${product.stockMin}</td>
                <td class="stock-difference ${stockDifferenceClass}">${product.difference}</td>
                <td>${product.daysLow} días</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>$${product.valueAtRisk}</td>
                <td>${product.supplier}</td>
                <td class="${priorityClass}">
                    ${product.priority === 'critical' ? 'Crítico' : 
                      product.priority === 'high' ? 'Alto' : 'Medio'}
                </td>
                <td>
                    <button class="btn btn-sm btn-primary restock-single-btn" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                    <button class="btn btn-sm btn-info view-btn" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
            
            totalRisk += parseFloat(product.valueAtRisk);
            totalToRestock += Math.max(0, product.stockMin - product.stockCurrent);
            estimatedCost += Math.max(0, product.stockMin - product.stockCurrent) * product.price;
        });
        
        // Actualizar resumen
        document.getElementById('productsShown').textContent = filteredProducts.length;
        document.getElementById('totalRiskTable').textContent = `$${totalRisk.toFixed(2)}`;
        document.getElementById('totalToRestock').textContent = `${totalToRestock} unidades`;
        document.getElementById('estimatedCost').textContent = `$${estimatedCost.toFixed(2)}`;
        
        // Añadir event listeners a los checkboxes
        document.querySelectorAll('.product-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const productId = parseInt(this.dataset.id);
                if (this.checked) {
                    selectedProducts.add(productId);
                } else {
                    selectedProducts.delete(productId);
                }
                updateSelectedCount();
            });
        });
        
        // Añadir event listeners a los botones de acción
        document.querySelectorAll('.restock-single-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                openRestockModal([productId]);
            });
        });
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                viewProductDetails(productId);
            });
        });
    }
    
    // Aplicar filtros
    function applyFilters() {
        const categoryFilter = document.getElementById('categoryFilterReport').value;
        const priorityFilter = document.getElementById('priorityFilter').value;
        const daysFilter = document.getElementById('daysFilter').value;
        
        filteredProducts = lowStockProducts.filter(product => {
            // Filtro por categoría
            if (categoryFilter && product.category !== categoryFilter) return false;
            
            // Filtro por prioridad
            if (priorityFilter && product.priority !== priorityFilter) return false;
            
            // Filtro por días
            if (daysFilter && product.daysLow < parseInt(daysFilter)) return false;
            
            return true;
        });
        
        renderProductsTable();
    }
    
    // Restablecer filtros
    function resetFilters() {
        document.getElementById('categoryFilterReport').value = '';
        document.getElementById('priorityFilter').value = '';
        document.getElementById('daysFilter').value = '';
        
        filteredProducts = [...lowStockProducts];
        renderProductsTable();
    }
    
    // Seleccionar todos los productos
    function toggleSelectAllProducts() {
        const selectAll = document.getElementById('selectAllReport').checked;
        const checkboxes = document.querySelectorAll('.product-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll;
            const productId = parseInt(checkbox.dataset.id);
            
            if (selectAll) {
                selectedProducts.add(productId);
            } else {
                selectedProducts.delete(productId);
            }
        });
        
        updateSelectedCount();
    }
    
    function selectAllProducts() {
        document.getElementById('selectAllReport').checked = true;
        toggleSelectAllProducts();
    }
    
    // Actualizar contador de seleccionados
    function updateSelectedCount() {
        const count = selectedProducts.size;
        document.getElementById('selectedCount')?.textContent = count;
        
        // Habilitar/deshabilitar botones según selección
        const exportSelectedBtn = document.getElementById('exportSelectedBtn');
        const restockSelectedBtn = document.getElementById('restockSelectedBtn');
        
        if (exportSelectedBtn) exportSelectedBtn.disabled = count === 0;
        if (restockSelectedBtn) restockSelectedBtn.disabled = count === 0;
    }
    
    // Inicializar gráficos
    function initializeCharts() {
        window.categoryChart = new Chart(
            document.getElementById('categoryChart'),
            {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#e74c3c',
                            '#f39c12',
                            '#3498db',
                            '#2ecc71',
                            '#9b59b6'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            }
        );
        
        window.trendChart = new Chart(
            document.getElementById('trendChart'),
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Productos con Stock Bajo',
                        data: [],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );
    }
    
    // Actualizar gráficos con datos
    function updateCharts() {
        // Gráfico por categoría
        const categoryCounts = {};
        lowStockProducts.forEach(product => {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        });
        
        window.categoryChart.data.labels = Object.keys(categoryCounts);
        window.categoryChart.data.datasets[0].data = Object.values(categoryCounts);
        window.categoryChart.update();
        
        // Gráfico de tendencia (datos simulados)
        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const trendData = days.map(() => Math.floor(Math.random() * 20) + 5);
        
        window.trendChart.data.labels = days;
        window.trendChart.data.datasets[0].data = trendData;
        window.trendChart.update();
    }
    
    // Actualizar lista de proveedores recomendados
    function updateSuppliersList() {
        const suppliersList = document.getElementById('suppliersList');
        const suppliers = [...new Set(lowStockProducts.map(p => p.supplier))];
        
        suppliersList.innerHTML = suppliers.map(supplier => `
            <div class="supplier-card">
                <div class="supplier-avatar">
                    <i class="fas fa-building"></i>
                </div>
                <div class="supplier-info">
                    <h4>${supplier}</h4>
                    <p>${Math.floor(Math.random() * 5) + 1} productos a reponer</p>
                    <p>Tiempo estimado: ${Math.floor(Math.random() * 7) + 2} días</p>
                    <button class="btn btn-sm btn-primary contact-supplier-btn" data-supplier="${supplier}">
                        Contactar
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Abrir modal de reposición
    function openRestockModal(productIds = null) {
        const modal = document.getElementById('restockModal');
        const productsToRestock = productIds ? 
            lowStockProducts.filter(p => productIds.includes(p.id)) :
            lowStockProducts.filter(p => selectedProducts.has(p.id));
        
        if (productsToRestock.length === 0) {
            alert('Por favor, selecciona al menos un producto para reponer.');
            return;
        }
        
        // Actualizar lista de productos
        const productsList = document.getElementById('restockProductsList');
        let totalCost = 0;
        
        productsList.innerHTML = productsToRestock.map(product => {
            const quantity = Math.max(0, product.stockMin - product.stockCurrent);
            const cost = quantity * product.price;
            totalCost += cost;
            
            return `
                <div class="product-summary-item">
                    <div>
                        <strong>${product.name}</strong>
                        <small>(${product.code})</small>
                    </div>
                    <div>
                        <span>Cantidad: ${quantity}</span>
                        <span style="margin-left: 20px;">Costo: $${cost.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        document.getElementById('restockTotal').textContent = `$${totalCost.toFixed(2)}`;
        
        // Mostrar modal
        modal.style.display = 'block';
    }
    
    // Cerrar modal de reposición
    function closeRestockModal() {
        document.getElementById('restockModal').style.display = 'none';
    }
    
    // Confirmar reposición
    function confirmRestock() {
        const supplier = document.getElementById('restockSupplier').value;
        const priority = document.getElementById('restockPriority').value;
        const notes = document.getElementById('restockNotes').value;
        
        if (!supplier) {
            alert('Por favor, selecciona un proveedor.');
            return;
        }
        
        // Aquí iría la lógica para enviar la solicitud de reposición
        alert(`Solicitud de reposición enviada a ${supplier} con prioridad ${priority}.`);
        
        // Cerrar modal
        closeRestockModal();
        
        // Limpiar selección
        selectedProducts.clear();
        document.getElementById('selectAllReport').checked = false;
        document.querySelectorAll('.product-checkbox').forEach(cb => cb.checked = false);
        updateSelectedCount();
    }
    
    // Exportar reporte
    function exportReport(format) {
        const modal = document.getElementById('exportModal');
        modal.style.display = 'block';
        
        // Configurar el formato seleccionado
        document.getElementById('exportFormat').value = format;
    }
    
    // Cerrar modal de exportación
    function closeExportModal() {
        document.getElementById('exportModal').style.display = 'none';
    }
    
    // Confirmar exportación
    function confirmExport() {
        const scope = document.querySelector('input[name="exportScope"]:checked').value;
        const format = document.getElementById('exportFormat').value;
        const email = document.getElementById('exportEmail').value;
        
        let productsToExport;
        
        switch (scope) {
            case 'all':
                productsToExport = lowStockProducts;
                break;
            case 'filtered':
                productsToExport = filteredProducts;
                break;
            case 'selected':
                productsToExport = lowStockProducts.filter(p => selectedProducts.has(p.id));
                break;
        }
        
        // Aquí iría la lógica real de exportación
        alert(`Exportando ${productsToExport.length} productos en formato ${format.toUpperCase()}...`);
        
        if (email) {
            alert(`Reporte enviado a ${email}`);
        }
        
        closeExportModal();
    }
    
    // Exportar productos seleccionados
    function exportSelectedProducts() {
        if (selectedProducts.size === 0) {
            alert('Por favor, selecciona al menos un producto para exportar.');
            return;
        }
        
        exportReport('excel');
    }
    
    // Imprimir reporte
    function printReport() {
        window.print();
    }
    
    // Generar orden de compra
    function generatePurchaseOrder() {
        alert('Generando orden de compra...');
        // Lógica para generar orden de compra
    }
    
    // Enviar alertas
    function sendAlerts() {
        alert('Enviando alertas a los responsables...');
        // Lógica para enviar alertas
    }
    
    // Programar reposición
    function scheduleRestock() {
        alert('Abriendo calendario para programar reposición...');
        // Lógica para programar reposición
    }
    
    // Comparar precios
    function comparePrices() {
        alert('Comparando precios entre proveedores...');
        // Lógica para comparar precios
    }
    
    // Ver detalles del producto
    function viewProductDetails(productId) {
        const product = lowStockProducts.find(p => p.id === productId);
        if (product) {
            alert(`Detalles de ${product.name}:\n\n` +
                  `Código: ${product.code}\n` +
                  `Categoría: ${product.category}\n` +
                  `Stock actual: ${product.stockCurrent}\n` +
                  `Stock mínimo: ${product.stockMin}\n` +
                  `Días en stock bajo: ${product.daysLow}\n` +
                  `Proveedor: ${product.supplier}\n` +
                  `Precio: $${product.price.toFixed(2)}`);
        }
    }
    
    // Función para obtener productos desde el inventario principal
    function getProductsFromInventory() {
        // Esta función debería comunicarse con el inventario principal
        // Para obtener los productos reales con stock bajo
        try {
            // Intentar obtener datos del localStorage o sessionStorage
            const inventoryData = localStorage.getItem('inventoryData') || 
                                 sessionStorage.getItem('inventoryData');
            
            if (inventoryData) {
                return JSON.parse(inventoryData).filter(product => 
                    product.status === 'low-stock' || 
                    (product.stockCurrent < product.stockMin)
                );
            }
        } catch (error) {
            console.error('Error al obtener datos del inventario:', error);
        }
        
        return []; // Retornar array vacío si no hay datos
    }
});