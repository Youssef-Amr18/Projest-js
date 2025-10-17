const searchInput = document.getElementById('input-search');
const searchBySelect = document.querySelector('.form-select');
const searchButton = document.getElementById('btn-search');
const cartItemsSpan = document.getElementById('cartItems');
const authBtns = document.getElementById('authBtns'); 
const userInfoDiv = document.getElementById('userInfo'); 
const logoutBtn = document.getElementById('logoutBtn');
const loginBtn = document.querySelector('.login.header');
const registerBtn = document.querySelector('.signup.header');
const welcomeMessageSpan = document.getElementById('welcomeMessage'); 
let allProductsData = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || []; 
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartItemsSpan) {
        cartItemsSpan.textContent = totalItems;
    }
}
function extractProductData(card) {
    const title = card.querySelector('.card-title')?.textContent || 'Unnamed Product';
    const priceText = card.querySelector('.card-text')?.textContent || 'Price: $0';
    const categoryText = card.querySelector('.text-muted')?.textContent || 'Category: N/A';
    const imageElement = card.querySelector('img');
    const price = parseFloat(priceText.replace('Price: $', '').trim()) || 0;
    const category = categoryText.replace('Category:', '').trim();
    const imageSrc = imageElement ? imageElement.src : 'default-image.jpg';
    let id = card.getAttribute('data-product-id');
    if (!id) {
         id = title.replace(/\s/g, '-').toLowerCase(); 
         card.setAttribute('data-product-id', id);
    }
    return { id, name: title, price, category, imageSrc, element: card };
}
function setupProducts() {
    const productCards = document.querySelectorAll('.col-md-4.items');
    allProductsData = Array.from(productCards).map(card => {
        const data = extractProductData(card);
        card.querySelector('.add')?.setAttribute('data-product-id', data.id);
        card.querySelector('.favorite-icon')?.setAttribute('data-product-id', data.id);
        const addButton = card.querySelector('.add');
        if (addButton) {
            addButton.addEventListener('click', () => handleAddToCart(data.id, 'button')); 
        }
        const cartIcon = card.querySelector('.add-to-cart-icon'); 
        if (cartIcon) {
            cartIcon.addEventListener('click', () => handleAddToCart(data.id, 'icon')); 
        }
        const favoriteIcon = card.querySelector('.favorite-icon');
        if (favoriteIcon) {
            favoriteIcon.addEventListener('click', () => toggleFavorite(data.id, favoriteIcon));
        }
        return data;
    });
}
function displayProducts(filteredData) {
    allProductsData.forEach(p => p.element.style.display = 'none');
    filteredData.forEach(product => {
        product.element.style.display = 'block';
    });
}
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const searchBy = searchBySelect.value; 
    if (searchTerm === '') {
        displayProducts(allProductsData);
        return;
    }
    const filteredProducts = allProductsData.filter(product => {
        let textToSearch = '';
        if (searchBy === '1') {
            textToSearch = product.name.toLowerCase();
        } else if (searchBy === '2') {
            textToSearch = product.category.toLowerCase();
        }
        return textToSearch.includes(searchTerm);
    });
    displayProducts(filteredProducts);
}
function handleAddToCart(productId, sourceType = 'direct') { 
    if (!currentUser) {
        alert("يرجى تسجيل الدخول لإضافة العناصر إلى سلة التسوق.");
        window.location.href = 'login.html';
        return;
    }
    const product = allProductsData.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId); 
    if (!product) return;
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            category: product.category,
            imageSrc: product.imageSrc,
            source: sourceType 
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    const cardElement = allProductsData.find(p => p.id === productId).element;
    const addButton = cardElement.querySelector('.add');
    if (addButton) {
        const newRemoveButton = addButton.cloneNode(true); 
        newRemoveButton.textContent = 'Remove from Cart';
        newRemoveButton.classList.remove('btn-primary', 'add');
        newRemoveButton.classList.add('btn-danger', 'remove');
        newRemoveButton.setAttribute('data-source', sourceType); 
        newRemoveButton.addEventListener('click', () => removeFromCart(productId));
        addButton.replaceWith(newRemoveButton);
    }
}
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    const productData = allProductsData.find(p => p.id === productId);
    if (!productData) return;
    const cardElement = productData.element;
    const removeButton = cardElement.querySelector('.remove');
    if (removeButton) {
        const newAddButton = removeButton.cloneNode(true);
        const originalSource = removeButton.getAttribute('data-source') || 'button'; 
        newAddButton.textContent = 'Add to Cart';
        newAddButton.classList.remove('btn-danger', 'remove');
        newAddButton.classList.add('btn-primary', 'add');
        newAddButton.addEventListener('click', () => handleAddToCart(productId, originalSource)); 
        removeButton.replaceWith(newAddButton);
    }
}
function toggleFavorite(productId, iconElement) {
    if (!currentUser) {
        alert("يرجى تسجيل الدخول لإضافة المنتج إلى المفضلة.");
        window.location.href = 'login.html';
        return;
    }
    const product = allProductsData.find(p => p.id === productId);
    const existingIndex = favorites.findIndex(item => item.id === productId);
    if (!product) return;
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        iconElement.classList.remove('is-favorited'); 
    } else {
        const productData = {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            imageSrc: product.imageSrc 
        };
        favorites.push(productData);
        iconElement.classList.add('is-favorited'); 
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
function updateAuthUI() {
    const cartIcon = cartItemsSpan ? cartItemsSpan.parentElement : null; 
    if (currentUser && currentUser.username) {
        if (welcomeMessageSpan) { 
            const displayUsername = currentUser.username || currentUser.firstName || 'صديقنا'; 
            welcomeMessageSpan.textContent = `Hello ${displayUsername}`; 
            welcomeMessageSpan.style.display = 'block';
        }
        if (authBtns) authBtns.style.display = 'none';
        if (userInfoDiv) userInfoDiv.style.display = 'flex'; 
        if (cartIcon) cartIcon.style.display = 'block';
    } else {
        if (welcomeMessageSpan) welcomeMessageSpan.style.display = 'none';
        if (authBtns) authBtns.style.display = 'flex';
        if (userInfoDiv) userInfoDiv.style.setProperty('display', 'none', 'important') ; 
        if (cartIcon) cartIcon.style.display = 'none';
    }
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser'); 
        localStorage.removeItem('cart');       
        currentUser = null;
        cart = [];
        favorites = []; 
        updateAuthUI();      
        updateCartCount();   
        alert('تم تسجيل الخروج بنجاح.');
        window.location.reload(); 
    });
}
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        window.location.href = 'register.html';
    });
}
if (searchButton) searchButton.addEventListener('click', handleSearch);
if (searchInput) searchInput.addEventListener('input', handleSearch);
if (searchBySelect) searchBySelect.addEventListener('change', handleSearch);
document.addEventListener('DOMContentLoaded', () => {
    setupProducts(); 
    favorites = JSON.parse(localStorage.getItem('favorites')) || []; 
    cart = JSON.parse(localStorage.getItem('cart')) || []; 
    allProductsData.forEach(product => {
        const isFavorite = favorites.some(item => item.id === product.id);
        const favoriteIcon = product.element.querySelector('.favorite-icon');
        if (favoriteIcon) { 
            if (isFavorite) {
                favoriteIcon.classList.add('is-favorited');
            } else {
                favoriteIcon.classList.remove('is-favorited');
            }
        }
    });
    cart.forEach(item => { 
        const productData = allProductsData.find(p => p.id === item.id); 
        if (productData) {
            const addButton = productData.element.querySelector('.add');
            if (addButton) {
                const newRemoveButton = addButton.cloneNode(true); 
                newRemoveButton.textContent = 'Remove from Cart';
                newRemoveButton.classList.remove('btn-primary', 'add');
                newRemoveButton.classList.add('btn-danger', 'remove');
                const sourceType = item.source || 'button'; 
                newRemoveButton.setAttribute('data-source', sourceType); 
                newRemoveButton.addEventListener('click', () => removeFromCart(item.id));
                addButton.replaceWith(newRemoveButton);
            }
        }
    });
    updateCartCount(); 
    updateAuthUI(); 
    displayProducts(allProductsData);
});
