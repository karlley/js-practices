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
  invalidSelectBookSQL,
  dropTableSQL,
} from "../db/queries.js";
import { titles } from "../db/titles.js";

async function main() {
  await runPromise(createTableSQL);

  try {
    const insertedBooks = await runMultiplePromise(
      invalidInsertBookSQL,
      titles,
    );
    if (insertedBooks.length === 0) {
      console.log("Books not found.");
    } else {
      insertedBooks.forEach((insertedBook) => {
        console.log(`ID: ${insertedBook.lastID} created.`);
      });
    }
  } catch (error) {
    console.error(`Insert failed: ${error.message}`);
  }

  try {
    const selectedBooks = await allPromise(invalidSelectBookSQL);
    if (selectedBooks.length === 0) {
      console.log("Books not found.");
    } else {
      selectedBooks.forEach((selectedBook) => {
        console.log(`ID: ${selectedBook.id}, Title: ${selectedBook.title}`);
      });
    }
  } catch (error) {
    console.error(`Select failed: ${error.message}`);
  }

  await runPromise(dropTableSQL);
  await closePromise();
}

(async () => {
  await main();
})();
