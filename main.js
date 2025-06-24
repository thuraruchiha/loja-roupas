// DARK MODE
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// SLIDER / CARROSSEL DE BANNERS
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function mudarSlide(n) {
  slideIndex = (slideIndex + n + slides.length) % slides.length;
  showSlide(slideIndex);
}

// Auto Slide a cada 5 segundos
setInterval(() => mudarSlide(1), 5000);

// CARRINHO (Simples usando localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

function updateCartDisplay() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement('li');
    li.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.length;
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartDisplay();
}

function openCart() {
  cartModal.style.display = 'block';
}

function closeCart() {
  cartModal.style.display = 'none';
}

cartBtn.addEventListener('click', openCart);
updateCartDisplay();

// FILTROS (Na página produtos.html)
function filtrarPorTamanho(tamanho) {
  const produtos = document.querySelectorAll('.produto');
  produtos.forEach(prod => {
    if (tamanho === 'todos' || prod.getAttribute('data-tamanho') === tamanho) {
      prod.style.display = 'block';
    } else {
      prod.style.display = 'none';
    }
  });
}

function filtrarPorCategoria(categoria) {
  const produtos = document.querySelectorAll('.produto');
  produtos.forEach(prod => {
    if (categoria === 'todos' || prod.getAttribute('data-categoria') === categoria) {
      prod.style.display = 'block';
    } else {
      prod.style.display = 'none';
    }
  });
}

// BUSCA POR NOME
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const termo = this.value.toLowerCase();
    const produtos = document.querySelectorAll('.produto');
    produtos.forEach(prod => {
      const nome = prod.getAttribute('data-nome').toLowerCase();
      prod.style.display = nome.includes(termo) ? 'block' : 'none';
    });
  });
}

// Para evitar que o carrinho feche ao clicar dentro dele
if (cartModal) {
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) closeCart();
  });
}
