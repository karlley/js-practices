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

function main() {
  const ids = [];
  runPromise(db, createTableSQL)
    .then(() => runPromise(db, invalidInsertBookSQL, titles[0]))
    .catch((error) => {
      console.error(`Insert failed: ${error}`);
    })
    .then((statement) => {
      if (statement) {
        ids.push(statement.lastID);
      }
      return runPromise(db, invalidInsertBookSQL, titles[1]);
    })
    .catch((error) => {
      console.error(`Insert failed: ${error}`);
    })
    .then((statement) => {
      if (statement) {
        ids.push(statement.lastID);
      }
      return runPromise(db, invalidInsertBookSQL, titles[2]);
    })
    .catch((error) => {
      console.error(`Insert failed: ${error}`);
    })
    .then((statement) => {
      if (statement) {
        ids.push(statement.lastID);
      }
      ids.forEach((id) => {
        console.log(`ID: ${id} inserted.`);
      });
      return allPromise(db, invalidSelectBookSQL);
    })
    .catch((error) => {
      console.error(`Select failed: ${error}`);
    })
    .then((rows) => {
      if (rows) {
        rows.forEach((row) => {
          console.log(`ID: ${row.id}, Title: ${row.title}`);
        });
      }
      return runPromise(db, dropTableSQL);
    })
    .then(() => closePromise(db));
}

main();
