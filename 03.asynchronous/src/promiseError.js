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

function main() {
  const ids = [];
  runPromise(db, createTableQuery)
    .then(() => runPromise(db, invalidInsertQuery, titles[0]))
    .then((statement) => {
      ids.push(statement.lastID);
    })
    .catch((error) => {
      console.error(`Insert failed: ${error.message}`);
    })
    .then(() => runPromise(db, invalidInsertQuery, titles[1]))
    .then((statement) => {
      ids.push(statement.lastID);
    })
    .catch((error) => {
      console.error(`Insert failed: ${error.message}`);
    })
    .then(() => runPromise(db, invalidInsertQuery, titles[2]))
    .then((statement) => {
      ids.push(statement.lastID);
    })
    .catch((error) => {
      console.error(`Insert failed: ${error.message}`);
    })
    .then(() => {
      ids.forEach((id) => {
        console.log(`ID: ${id} inserted.`);
      });
      return allPromise(db, invalidSelectQuery);
    })
    .then((rows) => {
      rows.forEach((row) => {
        console.log(`ID: ${row.id}, Title: ${row.title}`);
      });
    })
    .catch((error) => {
      console.error(`Select failed: ${error.message}`);
    })
    .then(() => runPromise(db, dropTableQuery))
    .then(() => closePromise(db));
}

main();
