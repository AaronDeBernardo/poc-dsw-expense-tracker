"use strict";
const path = require("node:path");
const { app, BrowserWindow, ipcMain } = require("electron/main");

let categories = [
  { id: 1, name: "Supermercado" },
  { id: 2, name: "Entretenimiento" },
  { id: 3, name: "Transporte" },
  { id: 4, name: "Salud" },
];
const expenses = [
  // {
  //   id: 27,
  //   name: "Entrada Cine",
  //   amount: 3500,
  //   category: {
  //     name: "Entretenimiento"
  //   }
  // },
];
let nextExpenseId = 0;
let nextId = 5;

let mainWindow;
let categoriesWindow;
let addExpenseWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join("renderer", "index.html"));
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("update-expenses", expenses);
  })
};

const createCategoriesWindows = () => {
  categoriesWindow = new BrowserWindow({
    width: 400,
    height: 400,
    parent: mainWindow, //se cierra al cerrar la ventana padre
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  categoriesWindow.loadFile(path.join("renderer", "categories.html"));

  categoriesWindow.once("ready-to-show", () => {
    categoriesWindow.send("categories", categories);
    categoriesWindow.show();
  });

  categoriesWindow.on("closed", () => {
    categoriesWindow = null;
  });
};

const createAddExpenseWindows = () => {

  addExpenseWindow = new BrowserWindow({
    width: 400,
    height: 400,
    parent: mainWindow,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  addExpenseWindow.loadFile(path.join("renderer", "expenses.html"));

  addExpenseWindow.once("ready-to-show", () => {
    addExpenseWindow.send("expenses", categories);
    addExpenseWindow.show();
  });

  addExpenseWindow.on("closed", () => {
    addExpenseWindow = null;
  });
};

// APP
app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow(); //para Mac
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit(); //si no es Mac
});

//WINDOWS
ipcMain.on("categories-window", () => {
  if (!categoriesWindow) {
    createCategoriesWindows();
  }
});

ipcMain.on("add-expense-window", () => {
  if (!addExpenseWindow) {
    createAddExpenseWindows();
  }
});

//METHODS
ipcMain.on("add-expense", (_event, data) => {
  expenses.push({ id: nextExpenseId++, name: data.name, category: data.category, amount: data.amount });
  mainWindow.webContents.send("update-expenses", expenses);
  addExpenseWindow.close();
});

ipcMain.on("add-category", (_event, data) => {
  categories.push({ id: nextId++, name: data.name });
  categoriesWindow.send("categories", categories);
});

ipcMain.on("delete-category", (_event, data) => {
  categories = categories.filter(
    (category) => category.id !== parseInt(data.id)
  );
  categoriesWindow.send("categories", categories);
});
