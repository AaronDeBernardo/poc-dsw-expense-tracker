"use strict";
document.getElementById("categoriesBtn").addEventListener("click", () => {
  window.api.send("categories-window");
});

document.getElementById("addExpenseBtn").addEventListener("click", () => {
  window.api.send("add-expense-window");
});

window.api.on("update-expenses", (expenses) => {
  if (expenses.length > 0) {
    const totalAmount = document.getElementById("totalAmount");
    const table = document.getElementById("expensesTable");
    const tableHeader = `
    <thead>
    <tr>
      <th>Fecha</th>
      <th>Categoría</th>
      <th>Descripción</th>
      <th>Monto</th>
      </tr>
      </thead>`
      ;

    let initialValue = 0;
    const items = expenses.reduce((html, e) => {
      initialValue += Number(e.amount);
      html += `<tr>
      <td>${e.date}</td>
      <td>${e.category.name}</td>
      <td>${e.name}</td>
      <td>$${e.amount}</td>
      </tr>`;
      return html;
    }, "");
    table.innerHTML = tableHeader + items;
    totalAmount.innerHTML = `Gastos totales: <span> $${initialValue} </span>`;
  } else {
    table.innerHTML = `No hay gastos registrados aún. Agrega uno para comenzar`;
  }
});
