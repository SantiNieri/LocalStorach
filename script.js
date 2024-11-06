
const productForm = document.getElementById('productForm');
const rubroInput = document.getElementById('rubro');
const productInput = document.getElementById('product');
const priceInput = document.getElementById('price');
const productList = document.getElementById('productList');


document.addEventListener('DOMContentLoaded', displayProducts);


function saveProduct(rubro, product, price) {
    let products = JSON.parse(localStorage.getItem('products')) || {};

    
    if (!products[rubro]) {
        products[rubro] = [];
    }

    
    products[rubro].push({ name: product, price: price });

    
    localStorage.setItem('products', JSON.stringify(products));
}


function displayProducts() {
    productList.innerHTML = ''; 

    
    const products = JSON.parse(localStorage.getItem('products')) || {};

    
    for (let rubro in products) {
        const rubroHeader = document.createElement('h3');
        rubroHeader.textContent = rubro;
        productList.appendChild(rubroHeader);

        products[rubro].forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <strong>Producto:</strong> ${product.name} <br>
                <strong>Precio:</strong> $${product.price.toFixed(2)}
            `;
            productList.appendChild(productCard);
        });
    }
}


productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    
    const rubro = rubroInput.value.trim();
    const product = productInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (rubro && product && !isNaN(price)) {
        
        saveProduct(rubro, product, price);

        
        displayProducts();

        
        productForm.reset();
    } else {
        alert('Por favor, completa todos los campos correctamente.');
    }