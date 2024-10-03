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
import { titles } from "../db/titles.js";

function main() {
  runPromise(createTableSQL)
    .then(() => {
      return runMultiplePromise(invalidInsertBookSQL, titles);
    })
    .then((insertedBooks) => {
      if (insertedBooks.length === 0) {
        console.log("Books not found.");
      } else {
        insertedBooks.forEach((insertedBook) => {
          console.log(`ID: ${insertedBook.lastID} created.`);
        });
      }
    })
    .catch((error) => {
      console.error(`Insert failed: ${error.message}`);
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
      console.error(`Fetch failed: ${error.message}`);
    })
    .finally(() => {
      return runPromise(deleteTableSQL).then(() => {
        return closePromise();
      });
    });
}

main();
