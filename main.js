"use strict";
const path = require("node:path");
const DataStore = require("./data-store");
const { app, BrowserWindow, ipcMain } = require("electron/main");

const dataStore = new DataStore({ name: "Main" });

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
    mainWindow.webContents.send("update-expenses", dataStore.expenses);
    mainWindow.webContents.send("update-chart", { expenses: dataStore.expenses });
  });
};

const createCategoriesWindows = () => {
  categoriesWindow = new BrowserWindow({
    width: 400,
    height: 400,
    parent: mainWindow,
    resizable: false,
    minimizable: false,
    //titleBarStyle: "hidden",
    //frame: false, me gustaría sacar el menú superior, pero desaparece el botón de cerrar y hay que realizar uno propio
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  categoriesWindow.loadFile(path.join("renderer", "categories.html"));

  categoriesWindow.once("ready-to-show", () => {
    categoriesWindow.send("categories", dataStore.categories);
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
    resizable: false,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  addExpenseWindow.loadFile(path.join("renderer", "expenses.html"));

  addExpenseWindow.once("ready-to-show", () => {
    addExpenseWindow.send("categories", dataStore.categories);
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
  let expense = {
    date: data.date,
    name: data.name,
    category: data.category,
    amount: data.amount,
  };

  const expenses = dataStore.addExpense(expense).expenses;
  mainWindow.webContents.send("update-expenses", expenses);
  mainWindow.webContents.send("update-chart", expenses);
  addExpenseWindow.close();
});

ipcMain.on("add-category", (_event, data) => {
  const categories = dataStore.addCategory(data.name).categories;
  categoriesWindow.send("categories", categories);
});

ipcMain.on("delete-category", (_event, data) => {
  const categories = dataStore.deleteCategory(data.id).categories;
  categoriesWindow.send("categories", categories);
});

// ipcMain.on("create-chart", (_event, data) => {

// })