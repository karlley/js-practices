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
  runPromise(db, createTableSQL)
    .then(() => runPromise(db, invalidInsertBookSQL, titles[0]))
    .then((book) => {
      console.log(`ID: ${book.lastID} created.`);
    })
    .catch((error) => {
      console.error(`Insert failed: ${error}`);
    })
    .then(() => runPromise(db, invalidInsertBookSQL, titles[1]))
    .then((book) => {
      console.log(`ID: ${book.lastID} created.`);
    })
    .catch((error) => {
      console.error(`Insert failed: ${error}`);
    })
    .then(() => runPromise(db, invalidInsertBookSQL, titles[2]))
    .then((book) => {
      console.log(`ID: ${book.lastID} created.`);
    })
    .catch((error) => {
      console.error(`Insert failed: ${error}`);
    })
    .then(() => allPromise(db, invalidSelectBookSQL))
    .then((books) => {
      books.forEach((book) => {
        console.log(`ID: ${book.id}, Title: ${book.title}`);
      });
      return runPromise(db, dropTableSQL);
    })
    .catch((error) => {
      console.error(`Select failed: ${error}`);
    })
    .then(() => closePromise(db));
}

main();
