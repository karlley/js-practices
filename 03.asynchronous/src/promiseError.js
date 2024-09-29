#!/usr/bin/env node
import {
  runPromise,
  allPromise,
  closePromise,
  runMultiplePromise,
} from "../db/promiseFunctions.js";
import {
  createTableSQL,
  invalidInsertBookSQL,
  invalidFetchBookSQL,
  deleteTableSQL,
} from "../db/queries.js";

const titles = ["書籍1", "書籍2", "書籍3"];

function main(titles) {
  runPromise(createTableSQL)
    .then(() => {
      return runMultiplePromise(invalidInsertBookSQL, titles);
    })
    .then((insertedBooks) => {
      insertedBooks.forEach((insertedBook) => {
        console.log(`ID: ${insertedBook.lastID} created.`);
      });
    })
    .catch((error) => {
      console.error(error.message);
      return Promise.resolve([]);
    })
    .then(() => {
      return allPromise(invalidFetchBookSQL);
    })
    .then((fetchedBooks) => {
      if (fetchedBooks.length === 0) {
        console.log("Books not found.");
      } else {
        fetchedBooks.forEach((fetchedBook) => {
          console.log(`ID: ${fetchedBook.id}, Title: ${fetchedBook.title}`);
        });
      }
    })
    .catch((error) => {
      console.error(error.message);
    })
    .finally(() => {
      runPromise(deleteTableSQL).then(() => {
        closePromise();
      });
    });
}

main(titles);
