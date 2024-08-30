#!/usr/bin/env node
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");
const titles = ["書籍1", "書籍2", "書籍3"];

const createTable = () => {
  db.run(
    `CREATE TABLE Books
         (
             id    INTEGER PRIMARY KEY AUTOINCREMENT,
             title TEXT UNIQUE
         )`,
    () => {
      console.log("created table");
      createBooks(titles);
    },
  );
};

const createBooks = (titles, index = 0) => {
  if (titles.length === index) {
    console.log("inserted record");
    getBooks();
    return;
  }

  db.run(
    `INSERT INTO Books (title)
         VALUES (?)`,
    [titles[index]],
    function () {
      console.log(this.lastID);
      createBooks(titles, index + 1);
    },
  );
};

const getBooks = () => {
  db.all(
    `SELECT *
         FROM Books`,
    (error, books) => {
      displayBooks(books);
    },
  );
};

const displayBooks = (books) => {
  books.forEach((book) => {
    console.log(`ID: ${book.id} Title: ${book.title}`);
  });
  deleteTable();
};

const deleteTable = () => {
  db.run(`DROP TABLE Books`, () => {
    console.log("deleted table");
    db.close();
  });
};

function main() {
  createTable();
}

main();
