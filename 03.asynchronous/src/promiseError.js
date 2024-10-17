#!/usr/bin/env node

import { db } from "../db/database.js";
import {
  runPromise,
  allPromise,
  closePromise,
} from "../db/promiseFunctions.js";
import {
  createTableSQL,
  invalidInsertBookSQL,
  invalidSelectBookSQL,
  dropTableSQL,
} from "../db/queries.js";
import { titles } from "../db/titles.js";

function main() {
  runPromise(db, createTableSQL)
    .then(() => {
      const insertedBooks = titles.map((title) => {
        return runPromise(db, invalidInsertBookSQL, [title])
          .then((insertedBook) => {
            console.log(`ID: ${insertedBook.lastID} created.`);
          })
          .catch((error) => {
            console.error(`Insert failed: ${error.message}`);
          });
      });
      return Promise.all(insertedBooks);
    })
    .then(() => {
      return allPromise(db, invalidSelectBookSQL)
        .then((selectedBooks) => {
          if (selectedBooks.length === 0) {
            console.log("Books not found.");
          } else {
            selectedBooks.forEach((selectedBook) => {
              console.log(
                `ID: ${selectedBook.id}, Title: ${selectedBook.title}`,
              );
            });
          }
        })
        .catch((error) => {
          console.error(`Select failed: ${error.message}`);
        });
    })
    .then(() => runPromise(db, dropTableSQL))
    .then(() => closePromise(db));
}

main();
