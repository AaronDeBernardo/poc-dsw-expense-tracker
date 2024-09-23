"use strict";

document.getElementById("categoriesBtn").addEventListener("click", () => {
  window.api.send("categories-window");
});

document.getElementById("addExpenseBtn").addEventListener("click", () => {
  window.api.send("add-expense-window");
});

window.api.on("update-expenses", (expenses) => {
  const ul = document.getElementById("expensesList");
  if (expenses.length > 0) {
    const items = expenses.reduce((html, e) => {
      html += `<div>
      <p>id: ${e.id} </p>
      <p>nombre: ${e.name} </p>
      <p>cantidad: ${e.amount} </p>
      <p>categoria: ${e.category.name} </p>
      </div>`;
      return html;
    }, "");
    ul.innerHTML = items;
  } else {
    ul.innerHTML = `<p>No hay gastos registrados aún. Agrega uno para comenzar</p>`;
  }
});
