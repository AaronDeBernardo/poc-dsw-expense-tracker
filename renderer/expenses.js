"use strict";

document.getElementById("date").valueAsDate = new Date();

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
  const dateInput = document.getElementById("date");
  const expenseNameInput = document.getElementById("expenseDescription");
  const expenseAmountInput = document.getElementById("expenseAmount");
  const categoriesSelect = document.getElementById("categoriesSelect");

  window.api.send("add-expense", {
    date: dateInput.value,
    name: expenseNameInput.value,
    amount: expenseAmountInput.value,
    category: {
      name: categoriesSelect.options[categoriesSelect.selectedIndex].text,
      id: categoriesSelect.value,
    },
  });

  expenseNameInput.value = "";
  expenseAmountInput.value = 0;
});
