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
        const book = await runPromise(db, invalidInsertBookSQL, [title]);
        console.log(`ID: ${book.lastID} created.`);
      } catch (error) {
        if (error.message.includes("SQLITE_ERROR")) {
          console.error(`Insert failed: ${error.message}`);
        } else {
          throw error;
        }
      }
    }),
  );

  try {
    const books = await allPromise(db, invalidSelectBookSQL);
    books.forEach((book) => {
      console.log(`ID: ${book.id}, Title: ${book.title}`);
    });
  } catch (error) {
    if (error.message.includes("SQLITE_ERROR")) {
      console.error(`Select failed: ${error.message}`);
    } else {
      throw error;
    }
  }

  await runPromise(db, dropTableSQL);
  await closePromise(db);
}

await main();
