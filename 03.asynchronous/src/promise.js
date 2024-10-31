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
  runPromise(db, createTableSQL)
    .then(() => runPromise(db, insertBookSQL, titles[0]))
    .then((book) => {
      console.log(`ID: ${book.lastID} created.`);
    })
    .then(() => runPromise(db, insertBookSQL, titles[1]))
    .then((book) => {
      console.log(`ID: ${book.lastID} created.`);
    })
    .then(() => runPromise(db, insertBookSQL, titles[2]))
    .then((book) => {
      console.log(`ID: ${book.lastID} created.`);
    })
    .then(() => allPromise(db, selectBookSQL))
    .then((books) => {
      books.forEach((book) => {
        console.log(`ID: ${book.id}, Title: ${book.title}`);
      });
      return runPromise(db, dropTableSQL);
    })
    .then(() => closePromise(db));
}

main();
