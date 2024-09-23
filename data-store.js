"use strict";

const Store = require("electron-store");

class DataStore extends Store {
  constructor(settings) {
    super(settings);

    this.categories = this.get("categories") || [];
    this.expenses = this.get("expenses") || [];

    this.nextCategoryId = this.getNextCategoryId();
    this.nextExpenseId = this.getNextExpenseId();
  }

  //Category

  saveCategories() {
    this.set("categories", this.categories);
    return this;
  }

  getCategories() {
    this.categories = this.get("categories") || [];
    return this;
  }

  addCategory(catName) {
    this.categories = [
      ...this.categories,
      { id: this.nextCategoryId++, name: catName },
    ];
    return this.saveCategories();
  }

  deleteCategory(id) {
    this.categories = this.categories.filter(
      (category) => category.id !== parseInt(id)
    );
    this.nextCategoryId = this.getNextCategoryId();
    return this.saveCategories();
  }

  getNextCategoryId() {
    return this.categories.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  }

  //Expense

  saveExpenses() {
    this.set("expenses", this.expenses);
    return this;
  }

  getExpenses() {
    this.expenses = this.get("expenses") || [];
    return this;
  }

  addExpense(expense) {
    expense.id = this.nextExpenseId++;
    this.expenses = [...this.expenses, expense];
    return this.saveExpenses();
  }

  getNextExpenseId() {
    return this.expenses.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  }
}

module.exports = DataStore;
