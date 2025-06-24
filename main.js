// main.js

// ===== DARK MODE =====
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

function loadDarkMode() {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'on') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️ Light Mode';
  } else {
    body.classList.remove('dark-mode');
    darkModeToggle.textContent = '🌙 Dark Mode';
  }
}

darkModeToggle?.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'on');
    darkModeToggle.textContent = '☀️ Light Mode';
  } else {
    localStorage.setItem('darkMode', 'off');
    darkModeToggle.textContent = '🌙 Dark Mode';
  }
});

loadDarkMode();


// ===== CARRINHO =====
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  let count = 0;
  cart.forEach(item => count += item.quantity);
  if(cartCountEl) cartCountEl.textContent = count;
}

// Abre modal do carrinho
cartBtn?.addEventListener('click', () => {
  renderCart();
  cartModal.style.display = 'block';
});

// Fecha modal
function closeCart() {
  cartModal.style.display = 'none';
}

// Renderiza itens do carrinho no modal
function renderCart() {
  if(!cartItemsEl) return;
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.name}</strong><br>
      R$ ${item.price.toFixed(2)} x 
      <input type="number" min="1" value="${item.quantity}" style="width:40px" onchange="updateQuantity(${index}, this.value)">
      = R$ ${(item.price * item.quantity).toFixed(2)}
      <button onclick="removeFromCart(${index})" style="margin-left:10px;color:red;">✖</button>
    `;
    cartItemsEl.appendChild(li);
  });
  cartTotalEl.textContent = total.toFixed(2);
}

// Atualiza quantidade do item
function updateQuantity(index, quantity) {
  quantity = parseInt(quantity);
  if(quantity <= 0) return;
  cart[index].quantity = quantity;
  saveCart();
  renderCart();
}

// Remove item do carrinho
function removeFromCart(index) {
  cart.splice(index,1);
  saveCart();
  renderCart();
}

// Adiciona ao carrinho
function addToCart(name, price) {
  // Se tamanho selecionado existe no produto-detalhe
  const tamanhoSelect = document.getElementById('tamanho');
  let tamanho = '';
  if(tamanhoSelect) {
    tamanho = tamanhoSelect.value;
    name += ` (${tamanho})`;
  }
  // Verifica se já existe no carrinho
  let found = cart.find(i => i.name === name);
  if(found) {
    found.quantity++;
  } else {
    cart.push({name, price, quantity:1});
  }
  saveCart();
  alert(`Produto "${name}" adicionado ao carrinho!`);
}

// ===== FILTROS E BUSCA =====
const searchInput = document.getElementById('searchInput');
let currentFilterTamanho = 'todos';
let currentFilterCategoria = 'todos';

function filtrarPorTamanho(tamanho) {
  currentFilterTamanho = tamanho;
  filtrarProdutos();
}

function filtrarPorCategoria(categoria) {
  currentFilterCategoria = categoria;
  filtrarProdutos();
}

function filtrarProdutos() {
  const produtos = document.querySelectorAll('.produto');
  const filtroTexto = searchInput ? searchInput.value.toLowerCase() : '';
  produtos.forEach(prod => {
    const nome = prod.getAttribute('data-nome').toLowerCase();
    const tamanho = prod.getAttribute('data-tamanho');
    const categoria = prod.getAttribute('data-categoria');

    const combinaTamanho = (currentFilterTamanho === 'todos' || tamanho === currentFilterTamanho);
    const combinaCategoria = (currentFilterCategoria === 'todos' || categoria === currentFilterCategoria);
    const combinaTexto = nome.includes(filtroTexto);

    if(combinaTamanho && combinaCategoria && combinaTexto) {
      prod.style.display = 'block';
    } else {
      prod.style.display = 'none';
    }
  });
}

searchInput?.addEventListener('input', filtrarProdutos);

// ===== CHECKOUT =====

function loadCheckoutCart() {
  const checkoutItems = document.getElementById('checkoutItems');
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutTotal = document.getElementById('checkoutTotal');
  if(!checkoutItems) return;

  checkoutItems.innerHTML = '';
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
    const li = document.createElement('li');
    li.textContent = `${item.name} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}`;
    checkoutItems.appendChild(li);
  });

  checkoutSubtotal.textContent = subtotal.toFixed(2);
  checkoutTotal.textContent = subtotal.toFixed(2);
  window.checkoutSubtotalValue = subtotal; // guarda valor para desconto
}

function aplicarCupom() {
  const cupomInput = document.getElementById('cupom');
  const cupomMensagem = document.getElementById('cupomMensagem');
  const checkoutTotal = document.getElementById('checkoutTotal');
  if(!cupomInput || !cupomMensagem || !checkoutTotal) return;

  const cupom = cupomInput.value.trim().toUpperCase();
  if(cupom === 'DESCONTO10') {
    const desconto = window.checkoutSubtotalValue * 0.10;
    const totalComDesconto = window.checkoutSubtotalValue - desconto;
    checkoutTotal.textContent = totalComDesconto.toFixed(2);
    cupomMensagem.textContent = 'Cupom aplicado! 10% de desconto.';
    cupomMensagem.style.color = 'green';
    window.checkoutTotalValue = totalComDesconto;
  } else {
    checkoutTotal.textContent = window.checkoutSubtotalValue.toFixed(2);
    cupomMensagem.textContent = 'Cupom inválido.';
    cupomMensagem.style.color = 'red';
    window.checkoutTotalValue = window.checkoutSubtotalValue;
  }
}

function finalizarCompra(event) {
  event.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const email = document.getElementById('email').value.trim();

  if(!nome || !endereco || !email) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  if(cart.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  // Aqui você pode fazer uma chamada API real, mas só vamos limpar e redirecionar
  localStorage.removeItem('cart');
  alert('Pedido realizado com sucesso! Obrigado pela compra.');
  window.location.href = 'pedido-finalizado.html';
}

// ===== SLIDER (index.html) =====
let slideIndex = 0;

function mudarSlide(n) {
  const slides = document.querySelectorAll('.slide');
  slideIndex += n;
  if(slideIndex < 0) slideIndex = slides.length - 1;
  if(slideIndex >= slides.length) slideIndex = 0;
  slides.forEach(s => s.classList.remove('active'));
  slides[slideIndex].classList.add('active');
}

// Slider automático troca a cada 5s (index.html)
function autoSlide() {
  mudarSlide(1);
  setTimeout(autoSlide, 5000);
}
document.addEventListener('DOMContentLoaded', () => {
  if(document.querySelector('.slider')) {
    autoSlide();
  }
  // Atualiza contagem do carrinho ao carregar qualquer página
  updateCartCount();
  // Se estiver na página checkout, carrega itens
  if(document.getElementById('checkoutItems')) {
    loadCheckoutCart();
  }
});