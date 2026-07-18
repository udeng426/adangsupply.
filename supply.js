const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const form = document.querySelector('#contactForm');
const formMessage = document.querySelector('#formMessage');
const year = document.querySelector('#year');
const cartItems = document.querySelector('#cartItems');
const cartCount = document.querySelector('#cartCount');
const subtotalEl = document.querySelector('#subtotal');
const totalEl = document.querySelector('#total');
const checkoutBtn = document.querySelector('#checkoutBtn');
const checkoutMessage = document.querySelector('#checkoutMessage');
const paymentInputs = document.querySelectorAll('input[name="payment"]');
const shipping = 0;
let cart = [];

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

function renderCart() {
  if (!cartItems || !cartCount || !subtotalEl || !totalEl) {
    return;
  }

  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<li class="empty-cart">Keranjang masih kosong</li>';
    cartCount.textContent = '0 item';
    subtotalEl.textContent = formatCurrency(0);
    totalEl.textContent = formatCurrency(0);
    return;
  }

  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name} x${item.qty}</span><strong>${formatCurrency(item.price * item.qty)}</strong>`;
    cartItems.appendChild(li);
  });

  cartCount.textContent = `${cart.reduce((sum, item) => sum + item.qty, 0)} item`;
  subtotalEl.textContent = formatCurrency(subtotal);
  totalEl.textContent = formatCurrency(subtotal + shipping);
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  renderCart();
}

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');

    if (card) {
      addToCart(card.dataset.name, Number(card.dataset.price));
    }
  });
});

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (!checkoutMessage) {
      return;
    }

    if (cart.length === 0) {
      checkoutMessage.textContent = 'Keranjang masih kosong. Pilih produk terlebih dahulu.';
      return;
    }

    const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value || 'COD';
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0) + shipping;
    checkoutMessage.textContent = `Pembayaran ${selectedPayment} berhasil! Total yang harus dibayar ${formatCurrency(total)}.`;
    cart = [];
    renderCart();
  });
}

if (form && formMessage) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    formMessage.textContent = `Terima kasih, ${name || 'teman'}! Pesan Anda telah diterima.`;
    form.reset();
  });
}

renderCart();
