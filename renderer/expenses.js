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

  const expenseName = expenseNameInput.value.trim();
  const amount = expenseAmountInput.value;
  if (expenseName == null || expenseName == "" || amount < 0 || amount == '') {
    return;
  }
  window.api.send("add-expense", {
    date: dateInput.value,
    name: expenseName,
    amount: amount,
    category: {
      name: categoriesSelect.options[categoriesSelect.selectedIndex].text,
      id: categoriesSelect.value,
    },
  });

  expenseNameInput.value = "";
  expenseAmountInput.value = 0;
});
