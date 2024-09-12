#!/usr/bin/env node
import sqlite3 from "sqlite3";
import {
  createTableSQL,
  invalidCreateBooksSQL,
  invalidGetBooksSQL,
  deleteTableSQL,
} from "../db/queries.js";

const db = new sqlite3.Database(":memory:");
const titles = ["書籍1", "書籍2", "書籍3"];

const createTable = (callback) => {
  db.run(createTableSQL, () => {
    createBooks(titles, 0, callback);
  });
};

const createBooks = (titles, index = 0, callback) => {
  if (titles.length === index) {
    getBooks(callback);
    return;
  }

  db.run(invalidCreateBooksSQL, [titles[index]], function (error) {
    if (error) {
      callback(error);
      createBooks(titles, index + 1, callback);
    } else {
      console.log(`ID: ${this.lastID} created.`);
      createBooks(titles, index + 1, callback);
    }
  });
};

const getBooks = (callback) => {
  db.all(invalidGetBooksSQL, (error, books) => {
    if (error) {
      callback(error);
      deleteTable();
    } else {
      displayBooks(books);
    }
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

const displayError = (error) => {
  if (error) {
    console.error("Error: " + error.message);
  }
};

function main() {
  createTable(displayError);
}

main();
