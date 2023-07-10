// const e = require("connect-flash");

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

// swiper

var swiper = new Swiper(".review-slider", {
  loop: true,
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 5500,
    disableOnInteraction: false,
  },

  pagination: {
    el: ".swiper-pagination",
  },
});

class CartItem {
  constructor(name, img, price, id) {
    this.id = id
    this.name = name
    this.img = img
    this.price = price
    this.quantity = 1
  }
}

class LocalCart {
  static key = "cartItems"

  static getLocalCartItems() {
    let cartMap = new Map();
    const cart = localStorage.getItem(LocalCart.key)

    if (cart === null || cart.length === 0) return cartMap
    return new Map(Object.entries(JSON.parse(cart)))
  }

  static addItemToLocalCart(id, item) {
    let cart = LocalCart.getLocalCartItems()

    if (cart.has(id)) {
      let mapItem = cart.get(id)
      mapItem.quantity += 1

      cart.set(id, mapItem)
    }
    else
      cart.set(id, item)

    localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
  }

  static removeItemFromCart(id) {

    let cart = LocalCart.getLocalCartItems();

    if (cart.has(id)) {
      cart.delete(id)
      localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
    }

    if (cart.size === 0)
      localStorage.removeItem(LocalCart.key);
  }
}



// const cart = document.querySelector('.cart-items');
// const toggleCart = document.querySelector('.toggleCart');

// toggleCart.addEventListener('click', () => {
//   cart.classList.toggle('active');
// })
const cart = document.querySelector('.cart-items');
const toggleCart = document.querySelectorAll('.toggleCart');
const closeCart = document.querySelector('.close-cart');

toggleCart.forEach((e) => {
  e.addEventListener('click', () => {
    cart.classList.toggle('active');
  })
})
closeCart.addEventListener('click', () => {
  cart.classList.remove('active');
});

function empty() {
  var cartItems = document.getElementsByClassName('cart')[0];
  var empty = document.getElementsByClassName('empty')[0];
  var button = document.getElementsByClassName('place-order')[0];
  if (cartItems.hasChildNodes()) {
    empty.classList.add('active');
    enable(button);
  }
  else {
    empty.classList.remove('active');
    disable(button);
  }
}

function ready() {
  var removeCartItemBtn = document.getElementsByClassName('fa-trash');
  for (var i = 0; i < removeCartItemBtn.length; i++) {
    var button = removeCartItemBtn[i];
    button.addEventListener('click', removeCartItem)
  }
}


// const stripe = Stripe('pk_test_51M135mSEgiNHw8gEmGOQYTnqkTOJTaZNwaxsCYUwetMm6oahO0tiT3RPuEitUqqmyHAClxe0Ca11VQHc63pjIikd00vWeAbnyq');
const stripe = Stripe('pk_test_51NPLLMSDnYijKQ4dgrbX9QE92PTew8wnsIByS0DN1UFqTiBzLKVeyjAuC4ZJK0s7PfjaVLpOPKJ00tLm6USe4E1n00qfwDeATY');
const checkoutButton = document.getElementById('checkout-btn');

////////////////////////////////////////////////////////////////////////////

if (checkoutButton) {
  checkoutButton.addEventListener("click", function () {
    var items = []
    var ItemContainer = document.getElementsByClassName('cart')[0]
    var cartRows = ItemContainer.getElementsByClassName('cart-box')
    for (var i = 0; i < cartRows.length; i++) {
      var cartRow = cartRows[i]
      var quantityElement = cartRow.getElementsByClassName('Quantity')[0];
      var quantity = quantityElement.innerText.replace('Qty : ', '');
      var id = cartRow.dataset.id
      var title = cartRow.getElementsByClassName('cart-title')[0].innerText;
      var image = cartRow.getElementsByClassName('cart-image')[0].src;

      // console.log(image);

      var priceElement1 = cartRow.getElementsByClassName('price')[0];
      var priceElement2 = priceElement1.innerText.replace('Price $', '');
      var price = parseFloat(priceElement2.replace('/-', ''));

      items.push({
        id: id,
        name: title,
        image: image,
        price: price,
        quantity: quantity
      })
    }

    localStorage.removeItem(LocalCart.key);

    fetch("/create-checkout-session", {
      headers: { 'Content-Type': 'application/json' },
      method: "POST",
      body: JSON.stringify({
        // "product": {items}
        items: items,
      })
      // body: JSON.stringify(items),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then(function (result) {
        // If redirectToCheckout fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using error.message.
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function removeCartItem(event) {
  var btnClicked = event.target;

  var id = btnClicked.parentElement.getAttribute('data-id');
  LocalCart.removeItemFromCart(id)


  btnClicked.parentElement.parentElement.remove();
  empty();
  updateCartTotal();
}

function enable(button) {
  button.disabled = false;
  button.classList.remove('disabled');
}

function disable(button) {
  button.disabled = true;
  button.classList.add('disabled');
}

var btn = document.getElementsByClassName('place-order')[0];
if (btn) {
  disable(btn);
}
function changeCartNumber() {
  var num = document.getElementsByClassName('num')[0];

  var cartItemContainer = document.getElementsByClassName('cart')[0];
  var cartItemNames = cartItemContainer.getElementsByClassName('cart-title');

  num.innerText = cartItemNames.length;
}

function updateCartTotal() {

  var cartItemContainer = document.getElementsByClassName('cart')[0];
  var loop = cartItemContainer.getElementsByClassName('cart-title');
  var cartRows = cartItemContainer.getElementsByClassName('cart-box');
  var total = 0;

  for (var i = 0; i < loop.length; i++) {

    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName('price')[0];
    var quantityElement = cartRow.getElementsByClassName('Quantity')[0];

    var updatedPrice = priceElement.innerText.replace('Price', '');
    var price = parseFloat(updatedPrice.replace('$', ''));
    var quantity = quantityElement.innerText.replace('Qty : ', '');

    total = total + (price * quantity);
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName('total')[0].innerText = `Total : $${total}`

  changeCartNumber();
}


function DisplayLocal() {
  const items = LocalCart.getLocalCartItems()
  const size = items.size;

  if (items === null) return
  var ent = Object.fromEntries(items);

  for (var i = 0; i < size; i++) {
    var item = Object.values(ent)[i];
    var title = item.name;
    var quantity = item.quantity;
    var price = item.price;
    var img = item.img;
    var id = item.id;

    // addItemToCart(title, price, img, id);
    DisplayLocalCart(title, price, img, quantity, id);
  }
  empty()
  updateCartTotal()
}

var isOrderDefined = document.getElementsByClassName('order-container')[0];
if (isOrderDefined) {
  DisplayLocalOrder();
}

//order
function DisplayLocalOrder() {
  const items_data = document.getElementById('order_items').dataset.userItems;
  const items = JSON.parse(items_data);
  if (items === null || items == undefined) return
  var size = items.length;

  for (var i = 0; i < size; i++) {
    var item = items[i];
    var title = item.name;
    var quantity = item.quantity;
    var price = item.price;
    var img = item.image;
    var status = 'SUCCESS';
    DisplayOrder(title, price, img, quantity, status);
  }
}

function DisplayOrder(title, price, imageSrc, quantity) {
  var status = document.getElementById('status').dataset.status;
  var orderItems = document.getElementsByClassName('order-items')[0];

  var orderRow = document.createElement('div')
  orderRow.classList.add('order-row');
  var orderRowContents = `
      <div class="order-item order-column">
          <img class="order-item-image" src="${imageSrc}" width="100" height="100">
          <span class="order-item-title">${title}</span>
      </div>
      <span class="order-price order-column">$${price}</span>
      <span class="order-quantity order-column">${quantity}</span>
      <span class="btn-status">${status}</span>
  `
  orderRow.innerHTML = orderRowContents
  orderItems.append(orderRow)
  // if (status != 'FAILED') {
  //   const btnStatus = document.querySelector('.btn-status');
  //   btnStatus.style.backgroundColor = '#398552';
  // }
}

if (checkoutButton) {
  DisplayLocal()
}

function DisplayLocalCart(title, price, imageSrc, quantity, id) {
  var cartItems = document.getElementsByClassName('cart')[0];
  var cartRow = document.createElement('div');
  cartRow.classList.add('pk-box');

  var cartRowContents = `
    <div data-id=${id} class="cart-box">
      <i class="fa fa-trash"></i>
      <img class="cart-image" src="${imageSrc}" alt="food pic">
      <div class="content">
        <h3 class="cart-title">${title}</h3>
        <span class="price">${price}/-</span>
        <span class="Quantity">Qty : ${quantity}</span>
      </div>
    </div>`
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow.getElementsByClassName('fa-trash')[0].addEventListener('click', removeCartItem);
}

function addItemToCart(title, price, imageSrc, id) {
  var cartItems = document.getElementsByClassName('cart')[0];
  var cartItemNames = cartItems.getElementsByClassName('cart-title');

  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      var qty = parseFloat(document.getElementsByClassName('Quantity')[i].innerText.replace('Qty : ', ''));
      qty = qty + 1;
      document.getElementsByClassName('Quantity')[i].innerText = `Qty : ${qty}`;
      return;
    }
  }

  var cartRow = document.createElement('div');
  cartRow.classList.add('pk-box');

  var cartRowContents = `
    <div data-id=${id} class="cart-box">
      <i class="fa fa-trash"></i>
      <img class="cart-image" src="${imageSrc}" alt="food pic">
      <div class="content">
        <h3 class="cart-title">${title}</h3>
        <span class="price">${price}/-</span>
        <span class="Quantity">Qty : 1</span>
      </div>
    </div>`
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow.getElementsByClassName('fa-trash')[0].addEventListener('click', removeCartItem);
}

function addToCart(event) {

  var event_button = event.target;
  var shopItem = event_button.parentElement.parentElement;
  var title = shopItem.getElementsByClassName('title')[0].innerText;
  var price = shopItem.getElementsByClassName('price')[0].innerText;


  ///
  // var priceCart = shopItem.getElementsByClassName('price')[0].innerText.replace('$', '');
  const shopItem2 = event_button.parentElement.parentElement.parentElement.parentElement;
  const id = shopItem2.getAttribute("data-id");
  var imageSrc = shopItem2.getElementsByClassName('item-image')[0].src;
  const item = new CartItem(title, imageSrc, price, id);
  LocalCart.addItemToLocalCart(id, item);
  ///


  addItemToCart(title, price, imageSrc, id);
  updateCartTotal();
  empty();
}


var addToCartbtn = document.getElementsByClassName('add-to-cart');
for (var i = 0; i < addToCartbtn.length; i++) {
  var button = addToCartbtn[i];

  button.addEventListener('click', addToCart)
}

// document.getElementsByClassName('place-order')[0].addEventListener('click', purchase);



// Orders -




// 💥 password functionality show-hide

// const password = document.getElementById('#password');
const toggle = document.querySelector('.toggle');


function showHide() {
  if (password.type === 'password') {
    password.setAttribute('type', 'text');
    toggle.classList.add('hide');
    password.focus()
  }
  else {
    password.setAttribute('type', 'password');
    toggle.classList.remove('hide');
    password.focus()
  }
}
if (toggle) {
  toggle.addEventListener('click', showHide);
}

// toggle.forEach((e) => {
//   e.addEventListener('click', showHide);
// });
