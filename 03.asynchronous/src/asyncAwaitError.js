#!/usr/bin/env node

import { db } from "./db/database.js";
import { runPromise, allPromise, closePromise } from "./db/promiseFunctions.js";
import {
  createTableSQL,
  invalidInsertBookSQL,
  invalidSelectBookSQL,
  dropTableSQL,
} from "./db/queries.js";
import { titles } from "./db/titles.js";

async function main() {
  await runPromise(db, createTableSQL);
  const ids = [];
  try {
    ids.push((await runPromise(db, invalidInsertBookSQL, titles[0])).lastID);
  } catch (error) {
    console.error(`Insert failed: ${error}`);
  }
  try {
    ids.push((await runPromise(db, invalidInsertBookSQL, titles[1])).lastID);
  } catch (error) {
    console.error(`Insert failed: ${error}`);
  }
  try {
    ids.push((await runPromise(db, invalidInsertBookSQL, titles[2])).lastID);
  } catch (error) {
    console.error(`Insert failed: ${error}`);
  }
  ids.forEach((id) => {
    console.log(`ID: ${id} inserted.`);
  });
  let rows = [];
  try {
    rows = await allPromise(db, invalidSelectBookSQL);
  } catch (error) {
    console.error(`Select failed: ${error}`);
  }
  rows.forEach((row) => {
    console.log(`ID: ${row.id}, Title: ${row.title}`);
  });
  await runPromise(db, dropTableSQL);
  await closePromise(db);
}

await main();
