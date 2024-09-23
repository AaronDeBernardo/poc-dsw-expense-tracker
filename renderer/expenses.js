"use strict";

window.api.on("categories", (categories) => {
  const select = document.getElementById("categoriesSelect");

  const options = categories.reduce((html, c) => {
    html += `<option value="${c.id}">${c.name}</option>`;
    return html;
  }, "");
  select.innerHTML = options;
});

document.getElementById("expenseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const expenseNameInput = document.getElementById("expenseName");
  const expenseAmountInput = document.getElementById("expenseAmount");
  const categoriesSelect = document.getElementById("categoriesSelect");
  window.api.send("add-expense", {
    name: expenseNameInput.value,
    amount: expenseAmountInput.value,
    category: {
      name: categoriesSelect.options[categoriesSelect.selectedIndex].text,
      id: categoriesSelect.selectedIndex,
    },
  });
  expenseNameInput.value = "";
  expenseAmountInput.value = 0;
});
