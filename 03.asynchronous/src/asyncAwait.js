#!/usr/bin/env node

import {
  runPromise,
  allPromise,
  closePromise,
  runMultiplePromise,
} from "../db/promiseFunctions.js";
import {
  createTableSQL,
  insertBookSQL,
  selectBookSQL,
  dropTableSQL,
} from "../db/queries.js";
import { titles } from "../db/titles.js";

async function main() {
  await runPromise(createTableSQL);
  const insertedBooks = await runMultiplePromise(insertBookSQL, titles);
  insertedBooks.forEach((insertedBook) => {
    console.log(`ID: ${insertedBook.lastID} inserted.`);
  });
  const selectedBooks = await allPromise(selectBookSQL);
  selectedBooks.forEach((selectedBook) => {
    console.log(`ID: ${selectedBook.id}, Title: ${selectedBook.title}`);
  });
  await runPromise(dropTableSQL);
  await closePromise();
}

(async () => {
  await main();
})();
