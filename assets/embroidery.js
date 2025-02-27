// Bước 3: JavaScript để quản lý logic tính năng thêu
document.addEventListener("DOMContentLoaded", function () {
  // Khởi tạo tính năng thêu
  initEmbroideryFeature();

  // Xử lý sự kiện khi khách hàng thay đổi variant sản phẩm
  document.addEventListener("variant:change", function (event) {
    updateEmbroideryOptions(event.detail.variant);
  });
});

function initEmbroideryFeature() {
  const addEmbroideryCheckbox = document.getElementById("add-embroidery");
  if (!addEmbroideryCheckbox) return;

  // Hiển thị/ẩn form thêu khi checkbox được chọn
  addEmbroideryCheckbox.addEventListener("change", function () {
    const embroideryForm = document.getElementById("embroidery-form");
    if (this.checked) {
      embroideryForm.classList.remove("hidden");
      embroideryForm.classList.add("flex");
      updateTotalPrice();
    } else {
      embroideryForm.classList.add("hidden");
      updateTotalPrice();
    }
  });

  // Xử lý sự kiện khi người dùng thay đổi màu sắc hoặc font
  const colorOptions = document.querySelectorAll(
    'input[name="properties[Embroidery Color]"]'
  );
  const fontOptions = document.querySelectorAll(
    'input[name="properties[Embroidery Font]"]'
  );

  colorOptions.forEach((option) => {
    option.addEventListener("change", updateTotalPrice);
  });

  // Giới hạn ký tự cho trường nhập tên
  const nameInput = document.getElementById("embroidery-name");
  const charLimit = nameInput.getAttribute("maxlength");

  nameInput.addEventListener("input", function () {
    if (this.value.length > charLimit) {
      this.value = this.value.substring(0, charLimit);
    }
  });
}

function updateTotalPrice() {
  const addToCartButton = document.querySelector('button[name="add"]');
  const basePrice = parseFloat(
    addToCartButton.getAttribute("data-base-price").replace(/[^0-9.]/g, "")
  );
  let totalPrice = basePrice;

  // Kiểm tra xem có thêu không
  const addEmbroideryCheckbox = document.getElementById("add-embroidery");
  if (addEmbroideryCheckbox && addEmbroideryCheckbox.checked) {
    // Thêm giá cơ bản cho thêu
    const embroideryPriceText = document.querySelector(
      ".embroidery-options-container > div > span"
    ).textContent;
    const embroideryBasePrice = parseFloat(
      embroideryPriceText.replace(/[^0-9.]/g, "")
    );
    totalPrice += embroideryBasePrice;

    // Thêm giá cho màu sắc đã chọn
    const selectedColor = document.querySelector(
      'input[name="properties[Embroidery Color]"]:checked'
    );
    if (selectedColor) {
      totalPrice += parseFloat(selectedColor.getAttribute("data-price") || 0);
    }

    // Thêm giá cho font chữ đã chọn
    const selectedFont = document.querySelector(
      'input[name="properties[Embroidery Font]"]:checked'
    );
    if (selectedFont) {
      totalPrice += parseFloat(selectedFont.getAttribute("data-price") || 0);
    }
  }

  // Cập nhật giá hiển thị
  const priceElement = document.querySelector(".product__price");
  if (priceElement) {
    priceElement.textContent = formatMoney(totalPrice);
  }

  // Cập nhật data-price cho nút Add to Cart
  if (addToCartButton) {
    addToCartButton.setAttribute("data-price", totalPrice);
  }
}

function updateEmbroideryOptions(variant) {
  // Kiểm tra xem variant có hỗ trợ thêu hay không
  const embroideryContainer = document.querySelector("[data-product-id]");

  if (!embroideryContainer) return;

  fetch(
    `/products/${embroideryContainer.getAttribute("data-product-id")}?variant=${
      variant.id
    }&view=embroidery-json`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.embroidery_enabled) {
        embroideryContainer.classList.remove("hidden");

        // Cập nhật giới hạn ký tự
        const nameInput = document.getElementById("embroidery-name");
        nameInput.setAttribute("maxlength", data.embroidery_char_limit);

        // Cập nhật hình ảnh mẫu
        const previewImg = embroideryContainer.querySelector("img");
        if (previewImg && data.embroidery_image) {
          previewImg.src = data.embroidery_image;
        }

        // Cập nhật giá cơ bản
        const priceSpan = embroideryContainer.querySelector("> div > span");
        if (priceSpan) {
          priceSpan.textContent = "+" + formatMoney(data.embroidery_base_price);
        }

        updateTotalPrice();
      } else {
        embroideryContainer.classList.add("hidden");
      }
    })
    .catch((error) => {
      console.error("Error updating embroidery options:", error);
    });
}

// Hàm hỗ trợ để định dạng tiền tệ
function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
