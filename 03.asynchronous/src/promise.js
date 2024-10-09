#!/usr/bin/env node

import { db } from "../db/database.js";
import {
  runPromise,
  allPromise,
  closePromise,
} from "../db/promiseFunctions.js";
import {
  createTableSQL,
  insertBookSQL,
  selectBookSQL,
  dropTableSQL,
} from "../db/queries.js";
import { titles } from "../db/titles.js";

function main() {
  runPromise(db, createTableSQL)
    .then(() => {
      const insertedBooks = titles.map((title) =>
        runPromise(db, insertBookSQL, [title]),
      );
      return Promise.all(insertedBooks);
    })
    .then((insertedBooks) => {
      insertedBooks.forEach((insertedBook) => {
        console.log(`ID: ${insertedBook.lastID} inserted.`);
      });
    })
    .then(() => allPromise(db, selectBookSQL))
    .then((selectedBooks) => {
      selectedBooks.forEach((selectedBook) => {
        console.log(`ID: ${selectedBook.id}, Title: ${selectedBook.title}`);
      });
    })
    .then(() => runPromise(db, dropTableSQL))
    .then(() => closePromise(db));
}

main();
