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
  fetchBookSQL,
  deleteTableSQL,
} from "../db/queries.js";
import { titles } from "../db/constants.js";

async function main() {
  await runPromise(createTableSQL);
  const insertedBooks = await runMultiplePromise(insertBookSQL, titles);
  insertedBooks.forEach((insertedBook) => {
    console.log(`ID: ${insertedBook.lastID} created.`);
  });
  const fetchedBooks = await allPromise(fetchBookSQL);
  fetchedBooks.forEach((fetchedBook) => {
    console.log(`ID: ${fetchedBook.id}, Title: ${fetchedBook.title}`);
  });
  await runPromise(deleteTableSQL);
  await closePromise();
}

(async () => {
  await main();
})();
