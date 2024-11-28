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
  for (const title of titles) {
    let statement;
    try {
      statement = await runPromise(db, invalidInsertQuery, title);
    } catch (error) {
      console.error(`Insert failed: ${error.message}`);
    }
    if (statement) {
      ids.push(statement.lastID);
    }
  }
  ids.forEach((id) => {
    console.log(`ID: ${id} inserted.`);
  });
  let rows;
  try {
    rows = await allPromise(db, invalidSelectQuery);
  } catch (error) {
    console.error(`Select failed: ${error.message}`);
  }
  if (rows) {
    rows.forEach((row) => {
      console.log(`ID: ${row.id}, Title: ${row.title}`);
    });
  }
  await runPromise(db, dropTableQuery);
  await closePromise(db);
}

await main();
