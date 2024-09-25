"use strict";
document.getElementById("categoriesBtn").addEventListener("click", () => {
  window.api.send("categories-window");
});

document.getElementById("addExpenseBtn").addEventListener("click", () => {
  window.api.send("add-expense-window");
});

window.api.on("update-expenses", (expenses) => {
  const divNoExpensesMessage = document.getElementById("noExpensesMessage");
  if (expenses.length > 0) {
    divNoExpensesMessage.innerHTML = "";
    divNoExpensesMessage.style.display = "none";
    const table = document.getElementById("expensesTable");
    const totalAmount = document.getElementById("totalAmount");
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
    divNoExpensesMessage.innerHTML = `No hay gastos registrados aún. Agrega uno para comenzar`;
  }
});

function getRandomInt() {
  return Math.floor(Math.random() * 256);
}
function drawPieChart(data) {
  const canvas = document.getElementById('pieChart');
  const ctx = canvas.getContext('2d');
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;

  const ul = document.getElementById("categories-chart-list");
  ul.innerHTML = "";
  data.forEach((item) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI; // Calcula el ángulo del segmento

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 100, startAngle, startAngle + sliceAngle); // Dibuja el arco
    ctx.closePath();

    item.color = `rgb(${getRandomInt()},${getRandomInt()},${getRandomInt()})`;
    const li = document.createElement("li");
    li.innerText = item.label;
    li.style.color = `${item.color}`;
    ul.appendChild(li);

    ctx.fillStyle = item.color
    ctx.fill();

    ctx.strokeStyle = '#fff';
    ctx.stroke();


    startAngle += sliceAngle;
  });

}

window.api.on("update-chart", async (data) => {
  if (data.length == 0) {
    document.getElementById("pieChart").style.display = "none";
    return;
  }
  document.getElementById("pieChart").style.display = "block";
  const categoryCount = [];
  data.forEach(item => {
    const categoryName = item.category.name;
    if (!categoryCount[categoryName]) {
      categoryCount[categoryName] = Number(item.amount);
    }
    categoryCount[categoryName] += Number(item.amount);
  });
  const result = Object.entries(categoryCount).map(([label, value]) => ({
    label,
    value
  }));

  drawPieChart(result);
});

