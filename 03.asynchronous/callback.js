#!/usr/bin/env node
import sqlite3 from "sqlite3";
import {
  createTableSQL,
  createBooksSQL,
  getBooksSQL,
  deleteTableSQL,
} from "./db/queries.js";

const db = new sqlite3.Database(":memory:");
const titles = ["書籍1", "書籍2", "書籍3"];

const createTable = () => {
  db.run(createTableSQL, () => {
    createBooks(titles);
  });
};

const createBooks = (titles, index = 0) => {
  if (titles.length === index) {
    getBooks();
    return;
  }

  db.run(createBooksSQL, [titles[index]], function () {
    console.log(`ID: ${this.lastID} created.`);
    createBooks(titles, index + 1);
  });
};

const getBooks = () => {
  db.all(getBooksSQL, (error, books) => {
    displayBooks(books);
  });
};

const displayBooks = (books) => {
  books.forEach((book) => {
    console.log(`ID: ${book.id}, Title: ${book.title}`);
  });
  deleteTable();
};

const deleteTable = () => {
  db.run(deleteTableSQL, () => {
    closeDB();
  });
};

const closeDB = () => {
  db.close();
  return;
};

function main() {
  createTable();
}

main();
