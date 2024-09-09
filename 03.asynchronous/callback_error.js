#!/usr/bin/env node
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");
const titles = ["書籍1", "書籍2", "書籍3"];

const createTable = (callback) => {
  db.run(
    `CREATE TABLE Books
         (
             id    INTEGER PRIMARY KEY AUTOINCREMENT,
             title TEXT UNIQUE
         )`,
    () => {
      createBooks(titles, 0, callback);
    },
  );
};

const createBooks = (titles, index = 0, callback) => {
  if (titles.length === index) {
    getBooks(callback);
    return;
  }

  db.run(
    `INSERT INTO InvalidTable (title)
         VALUES (?)`,
    [titles[index]],
    function (error) {
      if (error) {
        callback(error);
        createBooks(titles, index + 1, callback);
      } else {
        console.log(`ID: ${this.lastID} created.`);
        createBooks(titles, index + 1, callback);
      }
    },
  );
};

const getBooks = (callback) => {
  db.all(
    `SELECT *
         FROM InvalidTable`,
    (error, books) => {
      if (error) {
        callback(error);
        deleteTable();
      } else {
        displayBooks(books);
      }
    },
  );
};

const displayBooks = (books) => {
  books.forEach((book) => {
    console.log(`ID: ${book.id}, Title: ${book.title}`);
  });
  deleteTable();
};

const deleteTable = () => {
  db.run(`DROP TABLE Books`, () => {
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