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
  selectBookSQL,
  dropTableSQL,
} from "../db/queries.js";
import { titles } from "../db/titles.js";

function main() {
  runPromise(createTableSQL)
    .then(() => {
      return runMultiplePromise(insertBookSQL, titles);
    })
    .then((insertedBooks) => {
      insertedBooks.forEach((insertedBook) => {
        console.log(`ID: ${insertedBook.lastID} inserted.`);
      });
    })
    .then(() => {
      return allPromise(selectBookSQL);
    })
    .then((selectedBooks) => {
      selectedBooks.forEach((selectedBook) => {
        console.log(`ID: ${selectedBook.id}, Title: ${selectedBook.title}`);
      });
    })
    .then(() => {
      return runPromise(dropTableSQL);
    })
    .then(() => {
      return closePromise();
    });
}

main();
