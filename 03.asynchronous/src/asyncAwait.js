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
      const book = await runPromise(db, insertBookSQL, [title]);
      console.log(`ID: ${book.lastID} inserted.`);
    }),
  );
  const books = await allPromise(db, selectBookSQL);
  books.forEach((book) => {
    console.log(`ID: ${book.id}, Title: ${book.title}`);
  });
  await runPromise(db, dropTableSQL);
  await closePromise(db);
}

await main();
