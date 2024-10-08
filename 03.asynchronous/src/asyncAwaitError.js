#!/usr/bin/env node

import { db } from "../db/database.js";
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
  await runPromise(db, createTableSQL);

  try {
    const insertedBooks = await runMultiplePromise(
      db,
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
    const selectedBooks = await allPromise(db, invalidSelectBookSQL);
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

  await runPromise(db, dropTableSQL);
  await closePromise(db);
}

(async () => {
  await main();
})();
