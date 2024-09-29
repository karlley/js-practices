#!/usr/bin/env node
import {
  runPromise,
  runMultiplePromise,
  allPromise,
  closePromise,
} from "../db/promiseFunctions.js";
import {
  createTableSQL,
  insertBookSQL,
  fetchBookSQL,
  deleteTableSQL,
} from "../db/queries.js";

const titles = ["書籍1", "書籍2", "書籍3"];

function main(titles) {
  runPromise(createTableSQL)
    .then(() => {
      return runMultiplePromise(insertBookSQL, titles);
    })
    .then((insertedBooks) => {
      insertedBooks.forEach((insertedBook) => {
        console.log(`ID: ${insertedBook.lastID} created.`);
      });
    })
    .then(() => {
      return allPromise(fetchBookSQL);
    })
    .then((fetchedBooks) => {
      fetchedBooks.forEach((fetchedBook) => {
        console.log(`ID: ${fetchedBook.id}, Title: ${fetchedBook.title}`);
      });
    })
    .finally(() => {
      runPromise(deleteTableSQL).then(() => {
        closePromise();
      });
    });
}

main(titles);
