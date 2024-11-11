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

function main() {
  const ids = [];
  runPromise(db, createTableSQL)
    .then(() => {
      return runPromise(db, insertBookSQL, titles[0]);
    })
    .then((statement) => {
      ids.push(statement.lastID);
      return runPromise(db, insertBookSQL, titles[1]);
    })
    .then((statement) => {
      ids.push(statement.lastID);
      return runPromise(db, insertBookSQL, titles[2]);
    })
    .then((statement) => {
      ids.push(statement.lastID);
      ids.forEach((id) => {
        console.log(`ID: ${id} inserted.`);
      });
      return allPromise(db, selectBookSQL);
    })
    .then((rows) => {
      rows.forEach((row) => {
        console.log(`ID: ${row.id}, Title: ${row.title}`);
      });
      return runPromise(db, dropTableSQL);
    })
    .then(() => closePromise(db));
}

main();
