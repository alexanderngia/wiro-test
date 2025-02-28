class EmbroideryCustomCart extends HTMLElement {
  constructor() {
    super();
    this.input = document.querySelectorAll("input.embroidery-checkbox");
    this.section = document.getElementById("embroidery-section");
    this.option = document.querySelector(".embroidery-display");
  }
  connectedCallback() {
    this.input.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const itemKey = checkbox.dataset.itemKey;
        const quantityItem = checkbox.dataset.quantity || 1;

        if (!e.target.checked && itemKey) {
          this.removeEmbroidery(itemKey, quantityItem, {
            "Add Embroidery": null,
            "Embroidery Character": null,
            "Embroidery Color": null,
            "Embroidery Font": null,
            "Embroidery Price": null,
            "Embroidery Image": null,
          });
          this.section.style.backgroundColor = "transparent";
          this.option.style.display = "none";
        }
      });
    });
  }

  removeEmbroidery = async (itemKey, quantity, properties) => {
    await fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: itemKey,
        quantity: quantity,
        properties: properties,
      }),
    });
  };
}

customElements.define("embroidery-custom-cart", EmbroideryCustomCart);
