"use strict";

document.getElementById("categoriesBtn").addEventListener("click", () => {
  window.api.send("categories-window");
});

document.getElementById("addExpenseBtn").addEventListener("click", () => {
  window.api.send("add-expense-window");
});

window.api.on("update-expenses", (expenses) => {
  const table = document.getElementById("expensesTable");
  if (expenses.length > 0) {
    const tableHeader = `<tr>
      <th>Fecha</th>
      <th>Categoría</th>
      <th>Descripción</th>
      <th>Monto</th>
      </tr>`;

    const items = expenses.reduce((html, e) => {
      html += `<tr>
      <td>${e.date}</td>
      <td>${e.category.name}</td>
      <td>${e.name}</td>
      <td>${e.amount}</td>
      </tr>`;
      return html;
    }, "");

    table.innerHTML = tableHeader + items;
  } else {
    table.innerHTML = `No hay gastos registrados aún. Agrega uno para comenzar`;
  }
});
