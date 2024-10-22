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
    .then(() => {
      const insertPromises = titles.map((title) => {
        return runPromise(db, invalidInsertBookSQL, [title])
          .then((book) => {
            console.log(`ID: ${book.lastID} created.`);
          })
          .catch((error) => {
            if (error.code === "SQLITE_ERROR") {
              console.error(`Insert failed: ${error.message}`);
            } else {
              throw error;
            }
          });
      });
      return Promise.all(insertPromises);
    })
    .then(() => {
      return allPromise(db, invalidSelectBookSQL)
        .then((books) => {
          books.forEach((book) => {
            console.log(`ID: ${book.id}, Title: ${book.title}`);
          });
        })
        .catch((error) => {
          if (error.code === "SQLITE_ERROR") {
            console.error(`Select failed: ${error.message}`);
          } else {
            throw error;
          }
        });
    })
    .then(() => runPromise(db, dropTableSQL))
    .then(() => closePromise(db));
}

main();
