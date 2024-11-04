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
  console.log(
    `ID: ${(await runPromise(db, insertBookSQL, titles[0])).lastID} inserted.`,
  );
  console.log(
    `ID: ${(await runPromise(db, insertBookSQL, titles[1])).lastID} inserted.`,
  );
  console.log(
    `ID: ${(await runPromise(db, insertBookSQL, titles[2])).lastID} inserted.`,
  );
  const books = await allPromise(db, selectBookSQL);
  books.forEach((book) => {
    console.log(`ID: ${book.id}, Title: ${book.title}`);
  });
  await runPromise(db, dropTableSQL);
  await closePromise(db);
}

await main();
