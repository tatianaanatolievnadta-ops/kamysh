const sizes = [
  { cm: 50, base: 220, image: "assets/img/product-vase.jpg" },
  { cm: 65, base: 260, image: "assets/img/interior-sofa.jpg" },
  { cm: 80, base: 320, image: "assets/img/product-bundle.jpg" },
  { cm: 100, base: 420, image: "assets/img/tall-floor.jpg" },
  { cm: 110, base: 480, image: "assets/img/hero-kamysh.jpg" },
];

const quantities = [5, 9, 10, 12, 15, 19, 25, 27];

const readyProducts = [
  {
    title: "Сухоцвет камыш",
    cm: 80,
    qty: 15,
    price: 812,
    old: 2702,
    image: "assets/img/product-bundle.jpg",
  },
  {
    title: "Сухоцвет камыш",
    cm: 65,
    qty: 10,
    price: 360,
    old: 1900,
    image: "assets/img/product-vase.jpg",
  },
  {
    title: "Пампасная трава",
    cm: 55,
    qty: 5,
    price: 641,
    old: 1050,
    image: "assets/img/interior-sofa.jpg",
  },
  {
    title: "Сухоцвет камыш",
    cm: 110,
    qty: 5,
    price: 1493,
    old: 10300,
    image: "assets/img/tall-floor.jpg",
  },
  {
    title: "Декоративный камыш",
    cm: 100,
    qty: 12,
    price: 1290,
    old: 3200,
    image: "assets/img/hero-kamysh.jpg",
  },
  {
    title: "Сухоцвет камыш",
    cm: 50,
    qty: 9,
    price: 490,
    old: 1200,
    image: "assets/img/closeup-plumes.jpg",
  },
  {
    title: "Камыш бежевый",
    cm: 70,
    qty: 5,
    price: 520,
    old: 1680,
    image: "assets/img/pampas1.jpg",
  },
  {
    title: "Напольный камыш",
    cm: 90,
    qty: 9,
    price: 980,
    old: 2450,
    image: "assets/img/tall-floor.jpg",
  },
];

const state = {
  size: sizes[2],
  qty: 15,
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

function formatPrice(value) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function calcPrice() {
  return Math.round(state.size.base * (state.qty / 10));
}

function matchesFilter(item) {
  switch (state.filter) {
    case "to60":
      return item.cm <= 60;
    case "60to90":
      return item.cm > 60 && item.cm <= 90;
    case "from100":
      return item.cm >= 100;
    case "qty5":
      return item.qty <= 5;
    case "qty10":
      return item.qty <= 10;
    default:
      return true;
  }
}

function renderChips(container, items, getLabel, isActive, onPick) {
  container.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip" + (isActive(item) ? " is-active" : "");
    button.textContent = getLabel(item);
    button.addEventListener("click", () => onPick(item));
    container.appendChild(button);
  });
}

function updateUI() {
  renderChips(
    sizeChips,
    sizes,
    (item) => `${item.cm} см`,
    (item) => item.cm === state.size.cm,
    (item) => {
      state.size = item;
      updateUI();
    }
  );

  renderChips(
    qtyChips,
    quantities,
    (item) => `${item} шт`,
    (item) => item === state.qty,
    (item) => {
      state.qty = item;
      updateUI();
    }
  );

  const price = calcPrice();
  const label = `${state.size.cm} см · ${state.qty} веточек`;
  previewImage.src = state.size.image;
  previewLabel.textContent = label;
  badgeQty.textContent = `${state.qty} веточек`;
  badgeSize.textContent = `${state.size.cm} см`;
  totalPrice.textContent = formatPrice(price);
  oldPrice.textContent = formatPrice(Math.round(price * 2.4));
  selectionField.value = `${label} · ${formatPrice(price)}`;
}

function goToOrder(prefix) {
  document.getElementById("order").scrollIntoView({ behavior: "smooth" });
  formStatus.textContent = `${prefix}: ${selectionField.value}`;
}

function pickProduct(item) {
  const matchedSize =
    sizes.find((size) => size.cm === item.cm) ||
    sizes.reduce((best, size) =>
      Math.abs(size.cm - item.cm) < Math.abs(best.cm - item.cm) ? size : best
    );
  state.size = matchedSize;
  state.qty = quantities.includes(item.qty) ? item.qty : quantities[0];
  updateUI();
  document.getElementById("build").scrollIntoView({ behavior: "smooth" });
}

function renderCatalog() {
  const items = readyProducts.filter(matchesFilter);
  productGrid.innerHTML = "";

  if (!items.length) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;color:var(--muted)">Нет позиций по фильтру — выберите другой.</p>`;
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
          <s>${formatPrice(item.old)}</s>
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
      formStatus.textContent = "Бот ещё не подключён. Пришлите токен и chat_id — подключу.";
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
