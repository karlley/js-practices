#!/usr/bin/env node

import { db } from "./db/database.js";
import { runPromise, allPromise, closePromise } from "./db/promiseFunctions.js";
import {
  createTableQuery,
  invalidInsertQuery,
  invalidSelectQuery,
  dropTableQuery,
} from "./db/queries.js";
import { titles } from "./db/titles.js";

async function main() {
  await runPromise(db, createTableQuery);
  const ids = [];
  const errors = [];
  for (const title of titles) {
    try {
      const statement = await runPromise(db, invalidInsertQuery, title);
      ids.push(statement.lastID);
    } catch (error) {
      errors.push(`Insert failed: ${error.message}`);
    }
  }
  ids.forEach((id) => {
    console.log(`ID: ${id} inserted.`);
  });
  let rows = [];
  try {
    rows = await allPromise(db, invalidSelectQuery);
  } catch (error) {
    errors.push(`Select failed: ${error.message}`);
  }
  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
  rows.forEach((row) => {
    console.log(`ID: ${row.id}, Title: ${row.title}`);
  });
}

try {
  await main();
} catch (error) {
  console.error(error.message);
} finally {
  await runPromise(db, dropTableQuery);
  await closePromise(db);
}
