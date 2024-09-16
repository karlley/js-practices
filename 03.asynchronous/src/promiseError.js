#!/usr/bin/env node
import {
  runPromise,
  allPromise,
  closePromise,
} from "../db/promiseFunctions.js";
import {
  createTableSQL,
  invalidCreateBooksSQL,
  invalidGetBooksSQL,
  deleteTableSQL,
} from "../db/queries.js";

const titles = ["書籍1", "書籍2", "書籍3"];

const createTable = () => {
  return runPromise(createTableSQL);
};

const createBooks = (titles, index = 0) => {
  if (titles.length === index) {
    return Promise.resolve();
  }

  return runPromise(invalidCreateBooksSQL, [titles[index]])
    .then((result) => {
      console.log(`ID: ${result.lastID} created.`);
      return createBooks(titles, index + 1);
    })
    .catch((error) => {
      displayError(error);
      return createBooks(titles, index + 1);
    });
};

const getBooks = () => {
  return allPromise(invalidGetBooksSQL);
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

const displayError = (error) => {
  if (error) {
    console.error("Error: " + error.message);
  }
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
    .catch((error) => {
      displayError(error);
    })
    .finally(() => {
      closeDB();
    });
}

main();
