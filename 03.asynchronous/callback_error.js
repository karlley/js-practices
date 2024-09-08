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
    (error) => {
      if (error) {
        callback(error);
        return;
      } else {
        console.log("Created Table");
        createBooks(titles, 0, callback);
      }
    },
  );
};

const createBooks = (titles, index = 0, callback) => {
  if (titles.length === index) {
    console.log("Created books");
    getBooks(callback);
    return;
  }

  db.run(
    `INSERT INTO Books (title)
         VALUES (?)`,
    [titles[index]],
    function (error) {
      if (error) {
        callback(error);
        return;
      } else {
        console.log(this.lastID);
        createBooks(titles, index + 1, callback);
      }
    },
  );
};

const getBooks = (callback) => {
  db.all(
    `SELECT *
         FROM Books`,
    (error, books) => {
      if (error) {
        callback(error);
        return;
      } else {
        displayBooks(books, callback);
      }
    },
  );
};

const displayBooks = (books, callback) => {
  if (!Array.isArray(books) || books.length === 0) {
    const errorMessage = !Array.isArray(books)
      ? "Invalid Data"
      : "No books found";
    callback(new Error(errorMessage));
    return;
  }
  books.forEach((book) => {
    console.log(`ID: ${book.id} Title: ${book.title}`);
  });
  deleteTable(callback);
};

const deleteTable = (callback) => {
  db.run(`DROP TABLE Books`, (error) => {
    if (error) {
      callback(error);
      return;
    } else {
      console.log("Deleted table");
      closeDB(callback);
    }
  });
};

const closeDB = (callback) => {
  db.close((error) => {
    if (!error) {
      callback(error);
      return;
    } else {
      console.log("Closed DB");
      return;
    }
  });
};

const errorHandler = (error) => {
  if (error) {
    console.error("Error: " + error.message);
  }
};

function main() {
  createTable(errorHandler);
}

main();
