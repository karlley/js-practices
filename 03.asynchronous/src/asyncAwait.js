#!/usr/bin/env node

import { db } from "./db/database.js";
import { runPromise, allPromise, closePromise } from "./db/promiseFunctions.js";
import {
  createTableSQL,
  insertBookSQL,
  selectBookSQL,
  dropTableSQL,
} from "./db/queries.js";
import { titles } from "./db/titles.js";

async function main() {
  await runPromise(db, createTableSQL);
  await Promise.all(
    titles.map(async (title) => {
      const insertedBook = await runPromise(db, insertBookSQL, [title]);
      console.log(`ID: ${insertedBook.lastID} inserted.`);
    }),
  );
  const selectedBooks = await allPromise(db, selectBookSQL);
  selectedBooks.forEach((selectedBook) => {
    console.log(`ID: ${selectedBook.id}, Title: ${selectedBook.title}`);
  });
  await runPromise(db, dropTableSQL);
  await closePromise(db);
}

await main();
