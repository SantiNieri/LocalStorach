const productForm = document.getElementById('productForm');
const rubroInput = document.getElementById('rubro');
const productInput = document.getElementById('product');
const priceInput = document.getElementById('price');
const stockInput = document.getElementById('stock');
const productList = document.getElementById('productList');

let currentEdit = null;

document.addEventListener('DOMContentLoaded', displayProducts);

function saveProduct(rubro, product, price, stock) {
    let products = JSON.parse(localStorage.getItem('products')) || {};

    rubro = rubro.toLowerCase();

    if (!products[rubro]) {
        products[rubro] = [];
    }

    products[rubro].push({ name: product, price: parseFloat(price), stock: parseInt(stock, 10) });
    localStorage.setItem('products', JSON.stringify(products));
}

function updateProduct(rubro, index, product, price, stock) {
    let products = JSON.parse(localStorage.getItem('products')) || {};
    products[rubro][index] = { name: product, price: parseFloat(price), stock: parseInt(stock, 10) };
    localStorage.setItem('products', JSON.stringify(products));
}

function deleteProduct(rubro, index) {
    let products = JSON.parse(localStorage.getItem('products')) || {};

    if (products[rubro]) {
        products[rubro].splice(index, 1);

        if (products[rubro].length === 0) {
            delete products[rubro];
        }

        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
    }
}

function displayProducts() {
    productList.innerHTML = '';

    const products = JSON.parse(localStorage.getItem('products')) || {};

    let grandTotal = 0;

    for (let rubro in products) {
        const rubroContainer = document.createElement('div');
        rubroContainer.innerHTML = `<h3>${rubro.charAt(0).toUpperCase() + rubro.slice(1)}</h3>`;

        const ul = document.createElement('ul');
        let rubroTotal = 0;

        products[rubro].forEach((product, index) => {
            const value = product.price * product.stock;
            rubroTotal += value;

            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${product.name}</strong><br>
                Precio: $${product.price.toFixed(2)}<br>
                Stock: ${product.stock}<br>
                Valor Total: $${value.toFixed(2)}
                <button class="edit-btn" data-rubro="${rubro}" data-index="${index}">Editar</button>
                <button class="delete-btn" data-rubro="${rubro}" data-index="${index}">Eliminar</button>
            `;
            ul.appendChild(li);
        });

        const totalLi = document.createElement('li');
        totalLi.innerHTML = `<strong>Total de ${rubro.charAt(0).toUpperCase() + rubro.slice(1)}:</strong> $${rubroTotal.toFixed(2)}`;
        totalLi.style.fontWeight = 'bold';
        ul.appendChild(totalLi);

        rubroContainer.appendChild(ul);
        productList.appendChild(rubroContainer);

        grandTotal += rubroTotal;
    }

    if (grandTotal > 0) {
        const grandTotalDiv = document.createElement('div');
        grandTotalDiv.innerHTML = `<h2>Total General: $${grandTotal.toFixed(2)}</h2>`;
        grandTotalDiv.style.marginTop = '20px';
        productList.appendChild(grandTotalDiv);
    }

    document.querySelectorAll('.delete-btn').forEach(btn =>
        btn.addEventListener('click', (e) => {
            const rubro = e.target.getAttribute('data-rubro');
            const index = e.target.getAttribute('data-index');
            deleteProduct(rubro, index);
        })
    );

    document.querySelectorAll('.edit-btn').forEach(btn =>
        btn.addEventListener('click', (e) => {
            const rubro = e.target.getAttribute('data-rubro');
            const index = e.target.getAttribute('data-index');
            editProduct(rubro, index);
        })
    );
}

function editProduct(rubro, index) {
    const products = JSON.parse(localStorage.getItem('products')) || {};
    const product = products[rubro][index];

    rubroInput.value = rubro.charAt(0).toUpperCase() + rubro.slice(1);
    productInput.value = product.name;
    priceInput.value = product.price;
    stockInput.value = product.stock;

    currentEdit = { rubro, index };

    const submitButton = productForm.querySelector('button');
    submitButton.textContent = 'Actualizar';
}

productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const rubro = rubroInput.value.trim().toLowerCase();
    const product = productInput.value.trim();
    const price = parseFloat(priceInput.value);
    const stock = parseInt(stockInput.value, 10);

    if (rubro && product && !isNaN(price) && !isNaN(stock)) {
        if (currentEdit) {
            updateProduct(currentEdit.rubro, currentEdit.index, product, price, stock);

            currentEdit = null;
            const submitButton = productForm.querySelector('button');
            submitButton.textContent = 'Agregar';
        } else {
            saveProduct(rubro, product, price, stock);
        }

        displayProducts();
        productForm.reset();
    } else {
        alert('Por favor, completa todos los campos correctamente.');
    }
});
