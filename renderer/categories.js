"use strict";

window.api.on("categories", (categories) => {
  const list = document.getElementById("categoriesList");

  const items = categories.reduce((html, c) => {
    html += `<li>${c.name}<button data-id="${c.id}" class="delete-button">Eliminar</button></li>`;
    return html;
  }, "");

  list.innerHTML = items;

  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", () => {
      window.api.send("delete-category", {
        id: button.getAttribute("data-id"),
      });
    });
  });
});

document.getElementById("categoryForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.target[0];
  window.api.send("add-category", { name: input.value });
  input.value = "";
});
