const API_URL = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";

document.addEventListener("DOMContentLoaded", () => {
    const cartList = document.querySelector("#cart-products-tab");
    const subtotalEl = document.querySelector("#subtotal");
    const totalEl = document.querySelector("#total");
    const loader = document.createElement("div");

    let cartData = [];
    let subtotal = 0;

    loader.classList.add("loader");
    loader.innerHTML = '<div class="loader-inner"></div>';
    document.body.appendChild(loader);

    const savedCart = localStorage.getItem("cartData");

    if (savedCart) {
        cartData = JSON.parse(savedCart);
        renderCartItems();
        calculateTotals();
        loader.remove();
    } else {
        fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
            cartData = data.items;
            saveCartToLocalStorage();
            renderCartItems();
            calculateTotals();
            loader.remove();
        })
        .catch((error) => {
            console.error("Error fetching cart data:", error);
            loader.remove();
        });
    }

    function saveCartToLocalStorage() {
        localStorage.setItem("cartData", JSON.stringify(cartData));
    }

    function renderCartItems() {
        cartList.innerHTML = "";
        cartData.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-prod-details")
            cartItem.innerHTML = `
                    <div class="cart-prod-img">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <p class="product-text" id="product-name">${item.title}</p>
                    <p class="product-text" id="product-price">Rs. ${item.price.toLocaleString('en-IN')}</p>
                    <p class="product-text" id="product-quantity"><input type="number" min="1" value="${item.quantity}" data-index="${index}"></p>
                    <p class="product-text" id="product-subtotal">Rs. ${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    <button id="product-remove" data-index="${index}">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.625 4H17.125V1.8125C17.125 0.847266 16.3402 0.0625 15.375 0.0625H6.625C5.65977 0.0625 4.875 0.847266 4.875 1.8125V4H1.375C0.891016 4 0.5 4.39102 0.5 4.875V5.75C0.5 5.87031 0.598437 5.96875 0.71875 5.96875H2.37031L3.0457 20.2695C3.08945 21.202 3.86055 21.9375 4.79297 21.9375H17.207C18.1422 21.9375 18.9105 21.2047 18.9543 20.2695L19.6297 5.96875H21.2812C21.4016 5.96875 21.5 5.87031 21.5 5.75V4.875C21.5 4.39102 21.109 4 20.625 4ZM15.1562 4H6.84375V2.03125H15.1562V4Z" fill="#B88E2F"/>
                        </svg>
                    </button>              
            `;
            cartList.appendChild(cartItem);
        });
        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll("#product-quantity input[type='number']").forEach((input) =>
            input.addEventListener("change", handleQuantityChange)
        );
        document.querySelectorAll("#product-remove").forEach((button) =>
            button.addEventListener("click", handleItemRemove)
        );
    }

    function handleQuantityChange(event) {
        const index = event.target.dataset.index;
        const newQuantity = parseInt(event.target.value);
        if (newQuantity > 0) {
            cartData[index].quantity = newQuantity;
            saveCartToLocalStorage();
            renderCartItems();
            calculateTotals();
        }
    }

    function handleItemRemove(event) {
        const index = event.target.dataset.index;

        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `
            <div class="modal-content">
                <p>Are you sure you want to remove this item?</p>
                <button id="confirm-remove" data-index="${index}">Yes</button>
                <button id="cancel-remove">No</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("confirm-remove").addEventListener("click", () => {
            cartData.splice(index, 1);
            saveCartToLocalStorage();
            renderCartItems();
            calculateTotals();
            modal.remove();
        });

        document.getElementById("cancel-remove").addEventListener("click", () => {
            modal.remove();
        });
    }

    function calculateTotals() {
        subtotal = cartData.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        subtotalEl.innerText = `Rs. ${subtotal.toLocaleString('en-IN')}`;
        totalEl.innerText =  `Rs. ${parseFloat(subtotal.toFixed(2)).toLocaleString('en-IN')}`;
    }

    const checkoutButton = document.querySelector(".cart-right-button");
    checkoutButton.addEventListener("click", () => {
        if (cartData.length === 0) {
            alert("Your cart is empty! Please add items to proceed.");
            return;
        }
    
        const checkOutModal = document.createElement("div");
        checkOutModal.classList.add("checkOut-modal");
        checkOutModal.innerHTML = `
            <div class="modal-content">
                <h2>Order Summary</h2>
                <p>Total: Rs. ${subtotal.toLocaleString('en-IN')}</p>
                <p>Shipping Charge: Free</p>
                <p>Estimated Delivery: 3-5 Business Days</p>
                <button id="confirm-checkout">Proceed to Payment</button>
                <button id="cancel-checkout">Cancel</button>
            </div>
        `;
        document.body.appendChild(checkOutModal);
    
        document.getElementById("confirm-checkout").addEventListener("click", () => {
            checkOutModal.remove();
        });
    
        document.getElementById("cancel-checkout").addEventListener("click", () => {
            checkOutModal.remove();
        });
    });
});

const mobileMenu = document.querySelector(".header-menu-box");
const mobileBtn = document.querySelector(".header-mobile-menu");
mobileBtn.addEventListener("click", () => {
    if(mobileMenu.style.display === "none"){
        mobileMenu.style.display = "flex";
    }else{
        mobileMenu.style.display = "none";
    }
})

  