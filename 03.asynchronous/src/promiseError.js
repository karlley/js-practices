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
    .catch((error) => {
      console.error(`Insert failed: ${error.message}`);
    })
    .then((statement) => {
      if (statement) {
        ids.push(statement.lastID);
      }
      return runPromise(db, invalidInsertQuery, titles[1]);
    })
    .catch((error) => {
      console.error(`Insert failed: ${error.message}`);
    })
    .then((statement) => {
      if (statement) {
        ids.push(statement.lastID);
      }
      return runPromise(db, invalidInsertQuery, titles[2]);
    })
    .catch((error) => {
      console.error(`Insert failed: ${error.message}`);
    })
    .then((statement) => {
      if (statement) {
        ids.push(statement.lastID);
      }
      ids.forEach((id) => {
        console.log(`ID: ${id} inserted.`);
      });
      return allPromise(db, invalidSelectQuery);
    })
    .catch((error) => {
      console.error(`Select failed: ${error.message}`);
    })
    .then((rows) => {
      if (rows) {
        rows.forEach((row) => {
          console.log(`ID: ${row.id}, Title: ${row.title}`);
        });
      }
      return runPromise(db, dropTableQuery);
    })
    .then(() => closePromise(db));
}

main();
