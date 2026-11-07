const typesList = ["PVC oyna", "Alyuminiy oyna", "Yog'och oyna", "Balkon oynasi", "Jalyuzi va furnitura"];
const colorsList = ["Oq", "Jigarrang", "Antrasit", "Oltin eman"];
const keywordsList = ["window", "windows", "balcony", "glass", "blinds", "door", "interior", "architecture", "construction", "house"];

const products = [];
let lockCounter = 100;

for (let i = 1; i <= 60; i++) {
  const typeIndex = (i - 1) % typesList.length;
  const typeName = typesList[typeIndex];
  const colorIndex = (i * 3) % colorsList.length;
  const colorName = colorsList[colorIndex];
  const keywordIndex = (i * 7) % keywordsList.length;
  const keyword = keywordsList[keywordIndex];
  
  let basePrice = 500000;
  if (typeName === "Alyuminiy oyna") basePrice = 1200000;
  if (typeName === "Yog'och oyna") basePrice = 2000000;
  if (typeName === "Balkon oynasi") basePrice = 800000;
  if (typeName === "Jalyuzi va furnitura") basePrice = 150000;
  
  const price = basePrice + ((i * 35000) % 700000);
  const rating = (i % 5 === 0) ? 4 : 5;
  const popularity = i * 12;
  
  products.push({
    id: i,
    name: typeName + " model " + i,
    type: typeName,
    color: colorName,
    price: price,
    rating: rating,
    popularity: popularity,
    word: keyword,
    lock: lockCounter
  });
  lockCounter++;
}

let cart = JSON.parse(localStorage.getItem("windowCart")) || [];
let displayedCount = 10;
let currentFilteredProducts = products;

const preloader = document.getElementById("preloader");
const randomPreloaderTime = 5000 + Math.floor(Math.random() * 3001);
const progressFill = document.getElementById("progressFill");
const loadingPercent = document.getElementById("loadingPercent");

let startTime = Date.now();
let progressInterval = setInterval(function() {
  let elapsed = Date.now() - startTime;
  let percent = Math.floor((elapsed / randomPreloaderTime) * 100);
  if (percent >= 100) {
    percent = 100;
    clearInterval(progressInterval);
  }
  if (progressFill) progressFill.style.width = percent + "%";
  if (loadingPercent) loadingPercent.textContent = percent + "%";
}, 50);

setTimeout(function() {
  clearInterval(progressInterval);
  if (progressFill) progressFill.style.width = "100%";
  if (loadingPercent) loadingPercent.textContent = "100%";
  
  preloader.classList.add("handle-turn");
  
  setTimeout(function() {
    preloader.classList.add("opening");
    
    setTimeout(function() {
      preloader.classList.add("hide");
    }, 1800);
  }, 500);
}, randomPreloaderTime);

const burgerBtn = document.getElementById("burgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
const burgerIcon = document.getElementById("burgerIcon");

burgerBtn.onclick = function() {
  mobileMenu.classList.toggle("active");
  if (mobileMenu.classList.contains("active")) {
    burgerIcon.className = "fa-solid fa-xmark";
  } else {
    burgerIcon.className = "fa-solid fa-bars";
  }
};

const mobileLinks = document.querySelectorAll(".mobile-link");
for (let i = 0; i < mobileLinks.length; i++) {
  mobileLinks[i].onclick = function() {
    mobileMenu.classList.remove("active");
    burgerIcon.className = "fa-solid fa-bars";
  };
}

const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartSidebar = document.getElementById("cartSidebar");

openCartBtn.onclick = function() {
  cartSidebar.classList.add("active");
};

closeCartBtn.onclick = function() {
  cartSidebar.classList.remove("active");
};

function showMessage(text, type) {
  const container = document.getElementById("notificationsContainer");
  const notification = document.createElement("div");
  notification.className = "notification " + type;
  
  const icon = document.createElement("i");
  if (type === "success") {
    icon.className = "fa-solid fa-circle-check";
  } else {
    icon.className = "fa-solid fa-circle-exclamation";
  }
  
  const span = document.createElement("span");
  span.textContent = text;
  
  const closeBtn = document.createElement("button");
  closeBtn.className = "notification-close";
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  closeBtn.onclick = function() {
    container.removeChild(notification);
  };
  
  notification.appendChild(icon);
  notification.appendChild(span);
  notification.appendChild(closeBtn);
  container.appendChild(notification);
  
  setTimeout(function() {
    if (notification.parentElement) {
      container.removeChild(notification);
    }
  }, 3500);
}

function updateCartCount() {
  const countElement = document.getElementById("cartCount");
  let totalCount = 0;
  for (let i = 0; i < cart.length; i++) {
    totalCount += cart[i].qty;
  }
  countElement.textContent = totalCount;
}

function saveCart() {
  localStorage.setItem("windowCart", JSON.stringify(cart));
}

function renderCart() {
  const cartList = document.getElementById("cartItemsList");
  const totalPriceElement = document.getElementById("cartTotalPrice");
  cartList.innerHTML = "";
  
  let totalPrice = 0;
  
  if (cart.length === 0) {
    cartList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 32px;">Savatcha bo\'sh</p>';
  } else {
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      totalPrice += item.price * item.qty;
      
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      
      const img = document.createElement("img");
      img.className = "cart-item-img";
      img.src = "https://loremflickr.com/600/450/" + item.word + "?lock=" + item.lock;
      img.alt = "rasm";
      img.onerror = function() {
        this.src = "https://picsum.photos/seed/window" + item.lock + "/600/450";
      };
      
      const infoDiv = document.createElement("div");
      infoDiv.className = "cart-item-info";
      
      const title = document.createElement("div");
      title.className = "cart-item-title";
      title.textContent = item.name;
      
      const price = document.createElement("div");
      price.className = "cart-item-price";
      price.textContent = item.price.toLocaleString() + " so'm";
      
      const controls = document.createElement("div");
      controls.className = "cart-item-controls";
      
      const minusBtn = document.createElement("button");
      minusBtn.className = "qty-btn";
      minusBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';
      minusBtn.onclick = (function(id) {
        return function() { changeQty(id, -1); };
      })(item.id);
      
      const qtySpan = document.createElement("span");
      qtySpan.className = "cart-item-qty";
      qtySpan.textContent = item.qty;
      
      const plusBtn = document.createElement("button");
      plusBtn.className = "qty-btn";
      plusBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
      plusBtn.onclick = (function(id) {
        return function() { changeQty(id, 1); };
      })(item.id);
      
      controls.appendChild(minusBtn);
      controls.appendChild(qtySpan);
      controls.appendChild(plusBtn);
      
      infoDiv.appendChild(title);
      infoDiv.appendChild(price);
      infoDiv.appendChild(controls);
      
      const removeBtn = document.createElement("button");
      removeBtn.className = "cart-item-remove";
      removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      removeBtn.onclick = (function(id) {
        return function() { removeFromCart(id); };
      })(item.id);
      
      itemDiv.appendChild(img);
      itemDiv.appendChild(infoDiv);
      itemDiv.appendChild(removeBtn);
      
      cartList.appendChild(itemDiv);
    }
  }
  
  totalPriceElement.textContent = totalPrice.toLocaleString() + " so'm";
  updateCartCount();
}

function addToCart(product) {
  let found = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id) {
      cart[i].qty++;
      found = true;
      break;
    }
  }
  if (!found) {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      word: product.word,
      lock: product.lock,
      qty: 1
    });
  }
  saveCart();
  renderCart();
  showMessage("Mahsulot savatchaga qo'shildi", "success");
}

function changeQty(id, delta) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].qty += delta;
      if (cart[i].qty <= 0) {
        cart.splice(i, 1);
      }
      break;
    }
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart.splice(i, 1);
      break;
    }
  }
  saveCart();
  renderCart();
  showMessage("Mahsulot savatchadan o'chirildi", "success");
}

const checkoutBtn = document.getElementById("checkoutBtn");
checkoutBtn.onclick = function() {
  if (cart.length === 0) {
    showMessage("Savatchangiz bo'sh", "error");
    return;
  }
  checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Buyurtma berilmoqda...';
  setTimeout(function() {
    cart = [];
    saveCart();
    renderCart();
    cartSidebar.classList.remove("active");
    checkoutBtn.textContent = "Buyurtma berish";
    showMessage("Buyurtmangiz muvaffaqiyatli qabul qilindi!", "success");
  }, 1500);
};

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const loadMoreContainer = document.getElementById("loadMoreContainer");
  const emptyState = document.getElementById("emptyState");
  grid.innerHTML = "";
  
  if (currentFilteredProducts.length === 0) {
    emptyState.style.display = "block";
    loadMoreContainer.style.display = "none";
    return;
  } else {
    emptyState.style.display = "none";
  }
  
  const limit = Math.min(displayedCount, currentFilteredProducts.length);
  
  for (let i = 0; i < limit; i++) {
    const product = currentFilteredProducts[i];
    
    const card = document.createElement("div");
    card.className = "product-card";
    
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "product-img-wrapper";
    
    const img = document.createElement("img");
    img.className = "product-img";
    img.src = "https://loremflickr.com/600/450/" + product.word + "?lock=" + product.lock;
    img.alt = "rasm";
    img.loading = "lazy";
    img.onerror = function() {
      this.src = "https://picsum.photos/seed/window" + product.lock + "/600/450";
    };
    imgWrapper.appendChild(img);
    
    const info = document.createElement("div");
    info.className = "product-info";
    
    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = product.type + " • " + product.color;
    
    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;
    
    const details = document.createElement("div");
    details.className = "product-details";
    
    const rating = document.createElement("div");
    rating.className = "product-rating";
    let starsHtml = "";
    for (let s = 0; s < product.rating; s++) {
      starsHtml += '<i class="fa-solid fa-star"></i>';
    }
    rating.innerHTML = starsHtml;
    
    details.appendChild(rating);
    
    info.appendChild(category);
    info.appendChild(name);
    info.appendChild(details);
    
    const footer = document.createElement("div");
    footer.className = "product-footer";
    
    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = product.price.toLocaleString() + " so'm";
    
    const addBtn = document.createElement("button");
    addBtn.className = "btn-gradient";
    addBtn.textContent = "Qo'shish";
    addBtn.onclick = (function(prod) {
      return function() { addToCart(prod); };
    })(product);
    
    footer.appendChild(price);
    footer.appendChild(addBtn);
    
    card.appendChild(imgWrapper);
    card.appendChild(info);
    card.appendChild(footer);
    
    grid.appendChild(card);
  }
  
  if (limit >= currentFilteredProducts.length) {
    loadMoreContainer.style.display = "none";
  } else {
    loadMoreContainer.style.display = "block";
  }
}

const loadMoreBtn = document.getElementById("loadMoreBtn");
loadMoreBtn.onclick = function() {
  displayedCount += 10;
  renderProducts();
};

function filterProducts() {
  const typeVal = document.getElementById("typeFilter").value;
  const colorVal = document.getElementById("colorFilter").value;
  const sortVal = document.getElementById("sortFilter").value;
  const searchVal = document.getElementById("shopSearchInput").value.toLowerCase();
  
  let result = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    let matchType = (typeVal === "all" || p.type === typeVal);
    let matchColor = (colorVal === "all" || p.color === colorVal);
    let matchSearch = p.name.toLowerCase().includes(searchVal);
    
    if (matchType && matchColor && matchSearch) {
      result.push(p);
    }
  }
  
  if (sortVal === "popular") {
    result.sort(function(a, b) {
      return b.popularity - a.popularity;
    });
  } else if (sortVal === "cheap") {
    result.sort(function(a, b) {
      return a.price - b.price;
    });
  } else if (sortVal === "expensive") {
    result.sort(function(a, b) {
      return b.price - a.price;
    });
  }
  
  currentFilteredProducts = result;
  displayedCount = 10;
  renderProducts();
}

document.getElementById("typeFilter").onchange = filterProducts;
document.getElementById("colorFilter").onchange = filterProducts;
document.getElementById("sortFilter").onchange = filterProducts;
document.getElementById("shopSearchInput").oninput = filterProducts;

const headerSearchInput = document.getElementById("headerSearchInput");
headerSearchInput.oninput = function() {
  document.getElementById("shopSearchInput").value = headerSearchInput.value;
  filterProducts();
  document.getElementById("shop").scrollIntoView({ behavior: 'smooth' });
};

function renderPopular() {
  const popularGrid = document.getElementById("popularGrid");
  popularGrid.innerHTML = "";
  
  for (let i = 0; i < 6; i++) {
    const product = products[i];
    
    const card = document.createElement("div");
    card.className = "product-card";
    
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "product-img-wrapper";
    
    const img = document.createElement("img");
    img.className = "product-img";
    img.src = "https://loremflickr.com/600/450/" + product.word + "?lock=" + (product.lock + 500);
    img.alt = "rasm";
    img.loading = "lazy";
    img.onerror = function() {
      this.src = "https://picsum.photos/seed/windowpop" + product.lock + "/600/450";
    };
    imgWrapper.appendChild(img);
    
    const info = document.createElement("div");
    info.className = "product-info";
    
    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = product.type;
    
    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;
    
    info.appendChild(category);
    info.appendChild(name);
    
    const footer = document.createElement("div");
    footer.className = "product-footer";
    
    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = product.price.toLocaleString() + " so'm";
    
    const detailBtn = document.createElement("button");
    detailBtn.className = "btn-glass";
    detailBtn.textContent = "Batafsil";
    detailBtn.onclick = (function(prod) {
      return function() { openModal(prod); };
    })(product);
    
    footer.appendChild(price);
    footer.appendChild(detailBtn);
    
    card.appendChild(imgWrapper);
    card.appendChild(info);
    card.appendChild(footer);
    
    popularGrid.appendChild(card);
  }
}

const productModal = document.getElementById("productModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalBody = document.getElementById("modalBody");

function openModal(product) {
  modalBody.innerHTML = `
    <div style="display: flex; gap: 24px; flex-direction: column;">
      <div style="width: 100%; aspect-ratio: 4/3; background: #f2f2f2; border-radius: 12px; overflow: hidden;">
        <img src="https://loremflickr.com/600/450/${product.word}?lock=${product.lock}" alt="rasm" style="width: 100%; height: 100%; object-fit: contain;">
      </div>
      <div>
        <span style="color: var(--accent-color); font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">${product.type} • ${product.color}</span>
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; margin: 8px 0;">${product.name}</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 16px;">Ushbu mahsulot yuqori sifatli xomashyolardan tayyorlangan bo'lib, uyingiz uchun mukammal issiqlik va ovoz izolyatsiyasini ta'minlaydi. Uzoq yillar xizmat qiladi.</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 700;">${product.price.toLocaleString()} so'm</span>
          <button class="btn-gradient" id="modalAddBtn">Savatchaga qo'shish</button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById("modalAddBtn").onclick = function() {
    addToCart(product);
    productModal.classList.remove("active");
  };
  
  productModal.classList.add("active");
}

closeModalBtn.onclick = function() {
  productModal.classList.remove("active");
};

productModal.onclick = function(e) {
  if (e.target === productModal) {
    productModal.classList.remove("active");
  }
};

const historyData = [
  { year: "1300", title: "Dastlabki shisha oynalar", desc: "Qadimgi Rimda va Misrda derazalar uchun yupqa shisha plastinalar ishlatila boshlandi.", word: "interior", lock: 301 },
  { year: "1675", title: "Fransuz oynalari", desc: "Fransiyada cho'ziladigan shisha quyish texnologiyasi ixtiro qilindi, bu esa yirik oyna ramkalarini yaratish imkonini berdi.", word: "architecture", lock: 302 },
  { year: "1959", title: "Float shisha usuli", desc: "Alastair Pilkington tomonidan yaratilgan float usuli mutlaqo tekis va tiniq oyna ishlab chiqarish inqilobini boshlab berdi.", word: "glass", lock: 303 },
  { year: "1980", title: "Plastik (PVC) inqilobi", desc: "Germaniyada energiya tejamkor plastik profil oynalar ommalashib, bozorning asosiy qismiga aylandi.", word: "window", lock: 304 },
  { year: "2026", title: "Smart va ekologik oynalar", desc: "Zamonaviy intellektual qoplamali, quyosh nurlarini boshqaruvchi premium oynalar davri.", word: "house", lock: 305 }
];

function renderTimeline() {
  const timelineList = document.getElementById("timelineList");
  timelineList.innerHTML = "";
  
  for (let i = 0; i < historyData.length; i++) {
    const item = historyData[i];
    
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";
    
    const content = document.createElement("div");
    content.className = "timeline-content";
    
    const year = document.createElement("div");
    year.className = "timeline-year";
    year.textContent = item.year;
    
    const title = document.createElement("h3");
    title.textContent = item.title;
    
    const desc = document.createElement("p");
    desc.textContent = item.desc;
    
    content.appendChild(year);
    content.appendChild(title);
    content.appendChild(desc);
    
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "timeline-img-wrapper";
    
    const img = document.createElement("img");
    img.className = "timeline-img";
    img.src = "https://loremflickr.com/600/450/" + item.word + "?lock=" + item.lock;
    img.alt = "rasm";
    img.loading = "lazy";
    img.onerror = function() {
      this.src = "https://picsum.photos/seed/history" + item.lock + "/600/450";
    };
    imgWrapper.appendChild(img);
    
    timelineItem.appendChild(content);
    timelineItem.appendChild(imgWrapper);
    
    timelineList.appendChild(timelineItem);
  }
}

const faqQuestions = document.querySelectorAll(".faq-question");
for (let i = 0; i < faqQuestions.length; i++) {
  faqQuestions[i].onclick = function() {
    const parentItem = this.parentElement;
    const isActive = parentItem.classList.contains("active");
    
    for (let j = 0; j < faqQuestions.length; j++) {
      faqQuestions[j].parentElement.classList.remove("active");
    }
    
    if (!isActive) {
      parentItem.classList.add("active");
    }
  };
}

const newsletterBtn = document.getElementById("newsletterBtn");
newsletterBtn.onclick = function() {
  const emailInput = document.getElementById("newsletterInput");
  const emailVal = emailInput.value.trim();
  
  if (emailVal.includes("@") && emailVal.includes(".")) {
    showMessage("Obuna bo'lganingiz uchun rahmat!", "success");
    emailInput.value = "";
  } else {
    showMessage("Iltimos, to'g'ri email manzilini kiriting", "error");
  }
};

document.addEventListener("error", function(e) {
  if (e.target.tagName === "IMG") {
    if (!e.target.dataset.fallback) {
      e.target.dataset.fallback = "true";
      e.target.src = "https://picsum.photos/seed/windowfallback/600/450";
    }
  }
}, true);

renderCart();
renderProducts();
renderPopular();
renderTimeline();