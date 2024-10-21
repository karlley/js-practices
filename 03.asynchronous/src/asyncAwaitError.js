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

async function main() {
  await runPromise(db, createTableSQL);
  await Promise.all(
    titles.map(async (title) => {
      try {
        const insertedBook = await runPromise(db, invalidInsertBookSQL, [
          title,
        ]);
        console.log(`ID: ${insertedBook.lastID} created.`);
      } catch (error) {
        if (error.code === "SQLITE_ERROR") {
          console.error(`Insert failed: ${error.message}`);
        } else {
          throw error;
        }
      }
    }),
  );

  try {
    const selectedBooks = await allPromise(db, invalidSelectBookSQL);
    if (selectedBooks.length === 0) {
      console.log("Books not found.");
    } else {
      selectedBooks.forEach((selectedBook) => {
        console.log(`ID: ${selectedBook.id}, Title: ${selectedBook.title}`);
      });
    }
  } catch (error) {
    if (error.code === "SQLITE_ERROR") {
      console.error(`Select failed: ${error.message}`);
    } else {
      throw error;
    }
  }

  await runPromise(db, dropTableSQL);
  await closePromise(db);
}

await main();
