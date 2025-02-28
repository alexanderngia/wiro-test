class EmbroideryCustom extends HTMLElement {
  constructor() {
    super();
    this.changeEvent = new Event("change", { bubbles: true });
  }
  connectedCallback() {
    this.colorOptions = document.querySelectorAll(
      'input[name="properties[Embroidery Color]"]'
    );

    this.colorPrice = document.getElementById("embroidery-price");
    this.priceInput = document.getElementById("embroidery-price-input");
    this.embroideryForm = document.getElementById("embroidery-form");
    this.addEmbroideryCheckbox = document.getElementById("add-embroidery");
    this.nameInput = document.getElementById("embroidery-character");

    this.init();
  }

  init() {
    if (!this.addEmbroideryCheckbox || !this.embroideryForm) return;
    this.addEmbroideryCheckbox.addEventListener("change", () => {
      if (this.addEmbroideryCheckbox.checked) {
        this.embroideryForm.classList.remove("hidden");
        this.embroideryForm.classList.add("flex");
      } else {
        this.embroideryForm.classList.add("hidden");
      }
    });

    if (!this.colorOptions || this.colorOptions.length === 0) return;

    this.colorOptions.forEach((option) => {
      if (!option.dataset.price) return;

      option.addEventListener("change", () => {
        if (!this.colorPrice) return;
        this.colorPrice.textContent = option.dataset.price / 100;
        if (!this.priceInput) return;
        this.priceInput.value = parseInt(option.dataset.price);
        this.priceInput.dispatchEvent(this.changeEvent);
      });
    });

    if (!this.nameInput) return;
    const charLimit =
      parseInt(this.nameInput.getAttribute("maxlength"), 10) || 0;

    if (charLimit > 0) {
      this.nameInput.addEventListener("input", function () {
        if (this.value.length > charLimit) {
          this.value = this.value.substring(0, charLimit);
        }
      });
    }
  }
}

customElements.define("embroidery-custom", EmbroideryCustom);
