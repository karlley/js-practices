#!/usr/bin/env node
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");
const titles = ["書籍1", "書籍2", "書籍3"];

const runPromise = (sql, params = [], callback = null) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) {
        if (callback) {
          callback(error);
        } else {
          reject(error);
        }
      } else {
        if (callback) {
          callback(null);
        } else {
          resolve(this);
        }
      }
    });
  });
};

const allPromise = (sql, params = [], callback = null) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (error, rows) {
      if (error) {
        if (callback) {
          callback(error);
        } else {
          reject(error);
        }
      } else {
        if (callback) {
          callback(null, rows);
        } else {
          resolve(rows);
        }
      }
    });
  });
};

const closePromise = (callback = null) => {
  return new Promise((resolve, reject) => {
    db.close(function (error) {
      if (error) {
        if (callback) {
          callback(error);
        } else {
          reject(error);
        }
      } else {
        if (callback) {
          callback(null);
        } else {
          resolve(null);
        }
      }
    });
  });
};

const createTableSQL = `CREATE TABLE Books
                        (
                            id    INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT UNIQUE
                        )`;

const createBooksSQL = `INSERT INTO Books (title)
                        VALUES (?)`;

const getBooksSQL = `SELECT *
                     FROM Books`;

const deleteTableSQL = `DROP TABLE Books`;

const createTable = () => {
  return runPromise(createTableSQL);
};

const createBooks = (titles, index = 0) => {
  if (titles.length === index) {
    return Promise.resolve();
  }

  return runPromise(createBooksSQL, [titles[index]]).then((result) => {
    console.log(`ID: ${result.lastID} created.`);
    return createBooks(titles, index + 1);
  });
};

const getBooks = () => {
  return allPromise(getBooksSQL);
};

const displayBooks = (books) => {
  books.forEach((book) => {
    console.log(`ID: ${book.id}, Title: ${book.title}`);
  });
  return Promise.resolve();
};

const deleteTable = () => {
  return runPromise(deleteTableSQL);
};

const closeDB = () => {
  return closePromise();
};

function main() {
  createTable()
    .then(() => {
      return createBooks(titles);
    })
    .then(() => {
      return getBooks();
    })
    .then((books) => {
      return displayBooks(books);
    })
    .then(() => {
      return deleteTable();
    })
    .then(() => {
      return closeDB();
    })
    .then(() => {});
}

main();
