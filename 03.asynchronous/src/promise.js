#!/usr/bin/env node

import { db } from "../db/database.js";
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
  runPromise(db, createTableSQL)
    .then(() => {
      return runMultiplePromise(db, insertBookSQL, titles);
    })
    .then((insertedBooks) => {
      insertedBooks.forEach((insertedBook) => {
        console.log(`ID: ${insertedBook.lastID} inserted.`);
      });
    })
    .then(() => {
      return allPromise(db, selectBookSQL);
    })
    .then((selectedBooks) => {
      selectedBooks.forEach((selectedBook) => {
        console.log(`ID: ${selectedBook.id}, Title: ${selectedBook.title}`);
      });
    })
    .then(() => {
      return runPromise(db, dropTableSQL);
    })
    .then(() => {
      return closePromise(db);
    });
}

main();
