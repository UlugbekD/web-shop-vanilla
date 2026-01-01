document.addEventListener("DOMContentLoaded", () => {
  let items = 0;
  const cart = [];

  const itemQntEl = document.getElementById("itemQnt");
  const totalPriceEl = document.getElementById("totalPrice");
  const emptyBtn = document.querySelector(".empty__card");

  document.querySelectorAll(".shop--add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".shop--product-list__card");

      // get quantity entered by the user
      const qty = Number(card.querySelector(".shop--qty").value);

      if (qty <= 0) {
        alert("Quantity must be at least 1");
        return;
      }

      // get current product price (depends on selected property)
      const priceEl =
        card.querySelector(".product-price") ||
        card.querySelector("h4[data-price]");

      if (!priceEl) {
        console.warn("Price element not found in product card", card);
        alert(
          "Price is missing for this product. Please select a property or check the item definition."
        );
        return;
      }

      const price = Number(priceEl.dataset.price);

      // store item in cart (final total will be calculated on checkout)
      cart.push({ qty, price });

      // update items counter only (do not show total yet)
      items += qty;
      itemQntEl.textContent = items;

      // show subtotal preview (delivery is not included yet)
      let subtotal = 0;
      for (let i = 0; i < cart.length; i++) {
        subtotal = subtotal + cart[i].price * cart[i].qty;
      }
      document.getElementById("subtotalPrice").textContent = `$${subtotal}`;
    });
  });

  // when product property changes, update description and price
  document.querySelectorAll(".shop--prop").forEach((select) => {
    select.addEventListener("change", (e) => {
      const option = e.target.selectedOptions[0];
      const newPrice = option.dataset.price;
      const newDesc = option.dataset.desc;

      const card = e.target.closest(".shop--product-list__card");

      // update product description text
      const descEl = card.querySelector(".shop--product-list__desc");
      if (descEl) descEl.textContent = newDesc;

      // update price element on the product card
      const priceEl =
        card.querySelector(".product-price") ||
        card.querySelector("h4[data-price]");

      if (priceEl) {
        priceEl.dataset.price = newPrice;
        priceEl.textContent = `$${newPrice}`;
      } else {
        console.warn("No price element found for property change", card);
      }
    });
  });

  // clear cart and reset displayed values
  if (emptyBtn) {
    emptyBtn.addEventListener("click", () => {
      cart.length = 0;
      items = 0;
      itemQntEl.textContent = "0";
      totalPriceEl.textContent = "$0";
      document.getElementById("subtotalPrice").textContent = "$0";
    });
  }

  const checkoutBtn = document.querySelector(".checkout__btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      // validate payment method selection
      const payMethod = document.querySelector('input[name="payment"]:checked');
      if (!payMethod) {
        alert("Select a payment method.");
        return;
      }

      // validate name on card fields
      const nameFields = document.querySelectorAll(".card-name-field");
      if (nameFields.length !== 4) {
        alert("Fill all 4 Name on Card fields ");
        return;
      }

      for (let i = 0; i < nameFields.length; i++) {
        if (
          nameFields[i].value.trim() === "" ||
          nameFields[i].value.length > 15
        ) {
          alert("Fill all 4 Name on Card fields ");
          return;
        }
      }

      // validate card expiration date (month and year)
      const mmSel = document.getElementById("exp-month");
      const yySel = document.getElementById("exp-year");
      if (!mmSel || !yySel || !mmSel.value || !yySel.value) {
        alert("Select card expire month and year.");
        return;
      }
      const expMonth = Number(mmSel.value);
      const expYear = Number(yySel.value);
      const now = new Date();
      const expDate = new Date(expYear, expMonth, 0);

      if (expDate < now) {
        alert("Card expired — application withdrawn.");
        return;
      }

      // validate CVV (exactly 3 digits)
      const cvvInput = document.getElementById("cvv");
      if (!cvvInput || !/^[0-9]{3}$/.test(cvvInput.value)) {
        alert("CVV must be exactly 3 digits.");
        return;
      }
      //

      // calculate subtotal of all items in the cart
      let sum = 0;
      for (let i = 0; i < cart.length; i++) {
        sum = sum + cart[i].price * cart[i].qty;
      }

      // stop checkout if cart is empty
      if (sum === 0) {
        alert("Basket is empty");
        return;
      }

      const delivery = sum > 1000 ? 0 : Number((sum * 0.1).toFixed(2));

      const finalTotal = Number((sum + delivery).toFixed(2));

      totalPriceEl.textContent = `$${finalTotal}`;

      let message = "Subtotal: $" + sum + "\n";

      if (delivery === 0) {
        message = message + "Delivery: FREE\n";
      } else {
        message = message + "Delivery (10%): $" + delivery + "\n";
      }

      message =
        message +
        "Total: $" +
        finalTotal +
        "\n\n" +
        "Do you accept this total for payment?";

      if (confirm(message)) {
        alert("Thank you. Payment completed.");
      } else {
        alert("Application withdrawn.");
      }
    });
  }
  //contact us form

  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      if (fullName === "" || email === "" || message === "") {
        alert("Please fill all fields");
        return;
      }

      alert("Successfully sent");
      form.reset();
    });
  }
});
