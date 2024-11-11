#!/usr/bin/env node

import { db } from "./db/database.js";
import { runPromise, allPromise, closePromise } from "./db/promiseFunctions.js";
import {
  createTableQuery,
  insertQuery,
  selectQuery,
  dropTableQuery,
} from "./db/queries.js";
import { titles } from "./db/titles.js";

async function main() {
  await runPromise(db, createTableQuery);
  const ids = [];
  ids.push((await runPromise(db, insertQuery, titles[0])).lastID);
  ids.push((await runPromise(db, insertQuery, titles[1])).lastID);
  ids.push((await runPromise(db, insertQuery, titles[2])).lastID);
  ids.forEach((id) => {
    console.log(`ID: ${id} inserted.`);
  });
  const rows = await allPromise(db, selectQuery);
  rows.forEach((row) => {
    console.log(`ID: ${row.id}, Title: ${row.title}`);
  });
  await runPromise(db, dropTableQuery);
  await closePromise(db);
}

await main();
