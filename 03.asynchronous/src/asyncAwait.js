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
  const ids = [];
  ids.push((await runPromise(db, insertBookSQL, titles[0])).lastID);
  ids.push((await runPromise(db, insertBookSQL, titles[1])).lastID);
  ids.push((await runPromise(db, insertBookSQL, titles[2])).lastID);
  ids.forEach((id) => {
    console.log(`ID: ${id} inserted.`);
  });
  const rows = await allPromise(db, selectBookSQL);
  rows.forEach((row) => {
    console.log(`ID: ${row.id}, Title: ${row.title}`);
  });
  await runPromise(db, dropTableSQL);
  await closePromise(db);
}

await main();
