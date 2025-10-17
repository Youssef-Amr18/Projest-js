        function buildCartTable(items, title, containerId) {
            const container = document.getElementById(containerId);
            let total = 0;
            let cardsHTML = `
                <h4 class="mb-4 text-center">${title} (${items.length} Product)</h4>
                <div class="row">
            `;
            items.forEach(item => {
                const price = item.price ? Number(item.price) : 0;
                const quantity = item.quantity ? Number(item.quantity) : 0;
                const itemTotal = price * quantity;
                total += itemTotal;
            cardsHTML += `
                    <div class="col-md-6 mb-3">
                        <div class="card bg-secondary shadow-sm h-100">
                            <div class="row g-0 align-items-center">
                                <div class="col-4">
                                    <img src="${item.imageSrc || 'default-image.jpg'}" class="img-fluid rounded-start p-2" alt="${item.name}" style="height: 100%; max-height: 150px; object-fit: cover;">
                                </div>
                                <div class="col-8">
                                    <div class="card-body ">
                                        <h5 class="card-title mb-1">${item.name}</h5>
                                        <p class="card-text text-muted mb-1 small">
                                            Category: ${item.category || 'N/A'}
                                        </p>
                                        <p class="card-text mb-2">
                                            <strong class="text-danger">Price: $${price.toFixed(2)}</strong>
                                        </p>
                                        <div class="d-flex justify-content-strat align-items-center mt-2">
                                        <span class="ml-2">Quantity:</span>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                value="${quantity}" 
                                                class="form-control form-control-sm item-quantity-input mx-2"
                                                style="width: 40px; text-align: center;"
                                                onchange="updateQuantity('${item.id}', this.value)" >
                                            <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.id}')">Remove from Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            cardsHTML += `
                </div>
            `;
            container.innerHTML = cardsHTML;
            return total;
        }
        function buildFavoritesTable(items, title, containerId) {
            const container = document.getElementById(containerId);
            if (!container) return; 
            if (items.length === 0) {
                container.innerHTML = `
                    <h4 class="mb-3">${title} (0)</h4> 
                    <p class="alert alert-info text-right">لا توجد منتجات في قائمة المفضلة حالياً.</p>
                `;
                return; 
            }
            let cardsHTML = `
                <h4 class="mb-4">${title} (${items.length} منتج)</h4>
                <div class="row">
            `;
            items.forEach(item => {
                cardsHTML += `
                    <div class="col-md-3 col-sm-6 mb-4">
                        <div class="card bg-secondary shadow-sm h-100">
                            <img src="${item.imageSrc || 'default-image.jpg'}" class="card-img-top" alt="${item.name}" style="height: 180px; object-fit: cover;">
                            <div class="card-body d-flex flex-column">
                                <h6 class="card-title text-dark">${item.name}</h6>
                                <p class="card-text text-muted small mb-1">Category: ${item.category || 'N/A'}</p>
                                <p class="card-text mb-3 mt-auto">Price: <strong class="text-dark">$${item.price ? Number(item.price).toFixed(2) : 'N/A'}</strong></p>
                                <div class="d-flex justify-content-between mt-auto pt-2">
                                    <button class="btn btn-primary btn-sm w-50 me-1" onclick="addFromFavoritesToCart('${item.id}')">Add to Cart</button>
                                    <button class="btn btn-danger me-2 btn-sm w-50 ms-1" onclick="removeFromFavorites('${item.id}')">💔 Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            cardsHTML += `
                </div>
            `;
            container.innerHTML = cardsHTML;
        }
        function displayCartItems() {
            const directCartDiv = document.getElementById('directCartContainer');
            const wishlistCartDiv = document.getElementById('wishlistCartContainer');
            const totalPriceElement = document.getElementById('totalPrice');
            if (!directCartDiv || !wishlistCartDiv || !totalPriceElement) return;
            const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            const wishlistItems = currentCart.filter(item => item.source === 'wishlist');
            const directItems = currentCart.filter(item => item.source !== 'wishlist');
            if (currentCart.length === 0) {
                directCartDiv.innerHTML = '<p class="text-center alert alert-info">سلة التسوق فارغة حالياً. ابدأ التسوق!</p>';
                wishlistCartDiv.innerHTML = '';
                totalPriceElement.textContent =  `Total Price: $0.00`;
                return;
            }
            const directTotal = buildCartTable(directItems, '🛒 Items Added Directly', 'directCartContainer');
            const grandTotal = directTotal ;
            totalPriceElement.textContent =`Total Price: $${(Number(grandTotal) || 0).toFixed(2)}`;
        }
        function displayFavoritesItems() {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            buildFavoritesTable(favorites, '❤ Favorite Items List', 'favoritesContainer');
        }
        function updateQuantity(productId, newQuantity) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const quantity = parseInt(newQuantity);
            if (isNaN(quantity) || quantity <= 0) {
                displayCartItems();
                return;
            }
            const itemToUpdate = cart.find(item => item.id === productId);
            if (itemToUpdate) {
                itemToUpdate.quantity = quantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCartItems();
            }
        }
        function removeFromCart(productId) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
        }
        function removeFromFavorites(productId) {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites = favorites.filter(item => item.id !== productId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            displayFavoritesItems();
        }
        function addFromFavoritesToCart(productId) {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const product = favorites.find(p => p.id === productId);
            if (!product) return;
            const existingItem = cart.find(item => item.id === productId); 
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    category: product.category || 'N/A', 
                    source: 'wishlist',
                    imageSrc: product.imageSrc || 'default-image.jpg'
                });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            displayFavoritesItems(); 
            alert`(${product.name} has been added to the cart!)`;
        }
        document.addEventListener('DOMContentLoaded', () => {
            displayCartItems();
            displayFavoritesItems();
            if (!localStorage.getItem('cart')) {
                localStorage.setItem('cart', JSON.stringify([
                    { id: '1', name: 'Silver necklace', price: 450, quantity: 3, category: 'Necklace', source: 'direct', imageSrc: 'path/to/silver-necklace.jpg' },
                    { id: '2', name: 'Black Watch', price: 700, quantity: 1, category: 'Watches', source: 'direct', imageSrc: 'path/to/black-watch.jpg' },
                    { id: '3', name: 'Black bracelet', price: 200, quantity: 1, category: 'Bracelet', source: 'direct', imageSrc: 'path/to/black-bracelet.jpg' }
                ]));
            }
            if (!localStorage.getItem('favorites')) {
                localStorage.setItem('favorites', JSON.stringify([
                    { id: '10', name: 'Silver necklace', price: 450, category: 'Necklace', imageSrc: 'path/to/favorite-silver-necklace.jpg' },
                    { id: '11', name: 'Black Watch', price: 700, category: 'Watches', imageSrc: 'path/to/favorite-black-watch.jpg' },
                    { id: '12', name: 'Silver Set Rings', price: 300, category: 'Rings', imageSrc: 'path/to/silver-rings.jpg' },
                    { id: '13', name: 'Set Necklace', price: 550, category: 'Necklace', imageSrc: 'path/to/set-necklace.jpg' }
                ]));
            }
            displayCartItems();
            displayFavoritesItems(); 
        });