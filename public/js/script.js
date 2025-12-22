document.addEventListener('DOMContentLoaded', async function() {
    const productManager = new ProductManager();
    
    await loadProductsTable();
    
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992 && sidebar) {
            if (!sidebar.contains(event.target) && !toggleSidebarBtn.contains(event.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    async function loadProductsTable() {
        const productTableBody = document.getElementById('productTableBody');
        if (!productTableBody) return;

        productTableBody.innerHTML = '';
        
        const products = await productManager.getAllProducts();
        
        products.slice(0, 5).forEach(product => {
            const row = document.createElement('tr');
            
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
                default:
                    statusText = product.status || 'Desconocido';
                    statusClass = '';
            }
            
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center;">
                        <div class="product-image">
                            <i class="fas fa-box"></i>
                        </div>
                        <div style="margin-left: 10px;">
                            <div style="font-weight: bold;">${product.name}</div>
                            <div style="font-size: 0.8rem; color: #7f8c8d;">SKU: ${product.code}</div>
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
        
        updateDashboardCounters(products);
    }
    
    function updateDashboardCounters(products) {
        const productsCount = products.length;
        
        const productCountElement = document.querySelector('.dashboard-cards .card:nth-child(1) .card-value');
        if (productCountElement) {
            productCountElement.textContent = productsCount.toLocaleString();
        }
    }
});