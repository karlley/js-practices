#!/usr/bin/env node
import { runPromise, allPromise, closePromise } from "./promiseFunctions.js";

const titles = ["書籍1", "書籍2", "書籍3"];
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
