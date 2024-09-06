"use strict";

document.getElementById("categoriesBtn").addEventListener("click", () => {
  window.api.send("categories-window");
});
