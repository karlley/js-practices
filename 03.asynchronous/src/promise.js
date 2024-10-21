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
    .then(() => {
      const insertPromises = titles.map((title) => {
        return runPromise(db, insertBookSQL, [title]).then((book) => {
          console.log(`ID: ${book.lastID} created.`);
        });
      });
      return Promise.all(insertPromises);
    })
    .then(() => {
      return allPromise(db, selectBookSQL).then((books) => {
        books.forEach((book) => {
          console.log(`ID: ${book.id}, Title: ${book.title}`);
        });
      });
    })
    .then(() => runPromise(db, dropTableSQL))
    .then(() => closePromise(db));
}

main();
