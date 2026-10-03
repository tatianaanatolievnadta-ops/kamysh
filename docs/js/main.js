const PRICE_PER_STEM_50CM = 100; // 5 веток × 50 см = 500 ₽

const sizes = [
  { cm: 50, image: "assets/img/vase-ceramic-white.jpg" },
  { cm: 65, image: "assets/img/vase-ribbed.jpg" },
  { cm: 80, image: "assets/img/vase-glass-clear.jpg" },
  { cm: 100, image: "assets/img/vase-terracotta.jpg" },
  { cm: 110, image: "assets/img/vase-black-matte.jpg" },
  { cm: 120, image: "assets/img/vase-stone.jpg" },
];

const quantities = [5, 10, 15, 20, 30, 50, 100];

function priceFor(cm, qty) {
  return Math.round(PRICE_PER_STEM_50CM * (cm / 50) * qty);
}

const readyProducts = [
  { title: "Мини-пучок", cm: 50, qty: 5, image: "assets/img/vase-ceramic-white.jpg" },
  { title: "Для вазы", cm: 65, qty: 10, image: "assets/img/vase-ribbed.jpg" },
  { title: "Гостиная", cm: 80, qty: 15, image: "assets/img/vase-glass-clear.jpg" },
  { title: "Объёмный пучок", cm: 100, qty: 20, image: "assets/img/vase-terracotta.jpg" },
  { title: "Напольный", cm: 110, qty: 30, image: "assets/img/vase-black-matte.jpg" },
  { title: "Студия / витрина", cm: 120, qty: 50, image: "assets/img/vase-stone.jpg" },
  { title: "Оптом", cm: 80, qty: 100, image: "assets/img/vase-glass-clear.jpg" },
  { title: "Старт-набор", cm: 50, qty: 10, image: "assets/img/vase-ceramic-white.jpg" },
].map((item) => ({
  ...item,
  price: priceFor(item.cm, item.qty),
}));

const state = {
  size: sizes[0],
  qty: 5,
  customQty: null,
  filter: "all",
};

const sizeChips = document.getElementById("size-chips");
const qtyChips = document.getElementById("qty-chips");
const previewImage = document.getElementById("preview-image");
const previewLabel = document.getElementById("preview-label");
const badgeQty = document.getElementById("badge-qty");
const badgeSize = document.getElementById("badge-size");
const totalPrice = document.getElementById("total-price");
const oldPrice = document.getElementById("old-price");
const selectionField = document.getElementById("selection-field");
const builderForm = document.getElementById("builder-form");
const orderForm = document.getElementById("order-form");
const formStatus = document.getElementById("form-status");
const productGrid = document.getElementById("product-grid");
const toCart = document.getElementById("to-cart");
const shopFilters = document.getElementById("shop-filters");
const customQtyInput = document.getElementById("custom-qty");

function formatPrice(value) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function currentQty() {
  if (state.customQty && state.customQty > 0) return state.customQty;
  return state.qty;
}

function calcPrice() {
  return priceFor(state.size.cm, currentQty());
}

function matchesFilter(item) {
  switch (state.filter) {
    case "to60":
      return item.cm <= 65;
    case "60to90":
      return item.cm === 80;
    case "from100":
      return item.cm >= 100;
    case "qty5":
      return item.qty === 5;
    case "qty10":
      return item.qty === 10;
    case "qty15plus":
      return item.qty >= 15;
    default:
      return true;
  }
}

function renderSizeChips() {
  sizeChips.innerHTML = "";
  sizes.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip" + (item.cm === state.size.cm ? " is-active" : "");
    button.textContent = `${item.cm} см`;
    button.addEventListener("click", () => {
      state.size = item;
      updateUI();
    });
    sizeChips.appendChild(button);
  });
}

function renderQtyChips() {
  qtyChips.innerHTML = "";
  quantities.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    const active = !state.customQty && item === state.qty;
    button.className = "chip" + (active ? " is-active" : "");
    button.textContent = `${item} шт`;
    button.addEventListener("click", () => {
      state.qty = item;
      state.customQty = null;
      if (customQtyInput) customQtyInput.value = "";
      updateUI();
    });
    qtyChips.appendChild(button);
  });

  const customBtn = document.createElement("button");
  customBtn.type = "button";
  customBtn.className = "chip" + (state.customQty ? " is-active" : "");
  customBtn.textContent = "Под заказ";
  customBtn.addEventListener("click", () => {
    if (customQtyInput) {
      customQtyInput.focus();
      const value = Number(customQtyInput.value);
      state.customQty = value > 0 ? value : 1;
      updateUI();
    }
  });
  qtyChips.appendChild(customBtn);
}

function updateUI() {
  renderSizeChips();
  renderQtyChips();

  const qty = currentQty();
  const price = calcPrice();
  const label = `${state.size.cm} см · ${qty} веточек`;
  const stem = Math.round(PRICE_PER_STEM_50CM * (state.size.cm / 50));

  previewImage.src = state.size.image;
  previewLabel.textContent = `${label} · ${stem} ₽/ветка`;
  badgeQty.textContent = `${qty} веточек`;
  badgeSize.textContent = `${state.size.cm} см`;
  totalPrice.textContent = formatPrice(price);
  if (oldPrice) {
    oldPrice.textContent = `от ${formatPrice(priceFor(50, 5))} за мини`;
    oldPrice.style.textDecoration = "none";
  }
  selectionField.value = `${label} · ${formatPrice(price)}`;
}

function goToOrder(prefix) {
  document.getElementById("order").scrollIntoView({ behavior: "smooth" });
  formStatus.textContent = `${prefix}: ${selectionField.value}`;
}

function pickProduct(item) {
  const matchedSize = sizes.find((size) => size.cm === item.cm) || sizes[0];
  state.size = matchedSize;
  state.qty = quantities.includes(item.qty) ? item.qty : item.qty;
  state.customQty = quantities.includes(item.qty) ? null : item.qty;
  if (customQtyInput) {
    customQtyInput.value = state.customQty ? String(state.customQty) : "";
  }
  updateUI();
  document.getElementById("build").scrollIntoView({ behavior: "smooth" });
}

function renderCatalog() {
  const items = readyProducts.filter(matchesFilter);
  productGrid.innerHTML = "";

  if (!items.length) {
    productGrid.innerHTML =
      '<p style="grid-column:1/-1;color:var(--muted)">Нет позиций по фильтру — выберите другой.</p>';
    return;
  }

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tile";
    button.innerHTML = `
      <div class="tile-media">
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
        <span class="badge badge-qty">${item.qty} веточек</span>
        <span class="badge badge-size">${item.cm} см</span>
      </div>
      <div class="tile-body">
        <h3>${item.title}</h3>
        <p>натуральный · ${item.cm} см · ${item.qty} шт</p>
        <div class="tile-price">
          <strong>${formatPrice(item.price)}</strong>
        </div>
      </div>
    `;
    button.addEventListener("click", () => pickProduct(item));
    productGrid.appendChild(button);
  });
}

shopFilters.addEventListener("click", (event) => {
  const chip = event.target.closest(".filter-chip");
  if (!chip) return;
  state.filter = chip.dataset.filter;
  shopFilters.querySelectorAll(".filter-chip").forEach((node) => {
    node.classList.toggle("is-active", node === chip);
  });
  renderCatalog();
});

if (customQtyInput) {
  customQtyInput.addEventListener("input", () => {
    const value = Number(customQtyInput.value);
    if (value > 0) {
      state.customQty = Math.floor(value);
      updateUI();
    } else {
      state.customQty = null;
      updateUI();
    }
  });
}

builderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  goToOrder("Выбрано");
});

toCart.addEventListener("click", () => {
  goToOrder("В заказ");
});

async function sendOrderToTelegram(message) {
  const config = window.TELEGRAM_CONFIG || {};
  const token = String(config.botToken || "").trim();
  const chatId = String(config.chatId || "").trim();

  if (!token || !chatId || token.includes("ВСТАВЬТЕ") || chatId.includes("ВСТАВЬТЕ")) {
    throw new Error("no-config");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true,
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) {
    throw new Error(result.description || "telegram-error");
  }
}

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitBtn = orderForm.querySelector('button[type="submit"]');
  const data = new FormData(orderForm);
  const name = String(data.get("name") || "").trim();
  const contact = String(data.get("contact") || "").trim();
  const note = String(data.get("note") || "").trim();
  const selection = String(data.get("selection") || selectionField.value);

  const message = [
    "🌾 Новая заявка — Камыш",
    "📍 Отправка: Таганрог",
    "",
    `👤 Имя: ${name}`,
    `📞 Контакт: ${contact}`,
    `🛒 Выбор: ${selection}`,
    note ? `💬 Комментарий: ${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  submitBtn.disabled = true;
  formStatus.textContent = "Отправляем заявку в Telegram…";

  try {
    await sendOrderToTelegram(message);
    formStatus.textContent = "Готово! Заявка ушла в Telegram.";
    orderForm.reset();
  } catch (error) {
    if (error && error.message === "no-config") {
      formStatus.textContent = "Бот ещё не подключён на сайте. Локально заявки работают при наличии config.";
    } else {
      formStatus.textContent = "Не удалось отправить. Проверьте бота или напишите нам напрямую.";
      console.error(error);
    }
  } finally {
    submitBtn.disabled = false;
  }
});

renderCatalog();
updateUI();
