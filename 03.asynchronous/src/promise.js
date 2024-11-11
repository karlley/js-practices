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

function main() {
  const ids = [];
  runPromise(db, createTableQuery)
    .then(() => {
      return runPromise(db, insertQuery, titles[0]);
    })
    .then((statement) => {
      ids.push(statement.lastID);
      return runPromise(db, insertQuery, titles[1]);
    })
    .then((statement) => {
      ids.push(statement.lastID);
      return runPromise(db, insertQuery, titles[2]);
    })
    .then((statement) => {
      ids.push(statement.lastID);
      ids.forEach((id) => {
        console.log(`ID: ${id} inserted.`);
      });
      return allPromise(db, selectQuery);
    })
    .then((rows) => {
      rows.forEach((row) => {
        console.log(`ID: ${row.id}, Title: ${row.title}`);
      });
      return runPromise(db, dropTableQuery);
    })
    .then(() => closePromise(db));
}

main();
