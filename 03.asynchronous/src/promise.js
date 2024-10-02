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
import { titles } from "../db/constants.js";

function main() {
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
    .then(() => {
      return runPromise(deleteTableSQL);
    })
    .then(() => {
      return closePromise();
    });
}

main();
