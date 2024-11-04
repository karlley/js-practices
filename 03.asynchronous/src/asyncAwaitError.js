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
  try {
    console.log(
      `ID: ${(await runPromise(db, invalidInsertBookSQL, titles[0])).lastID} inserted.`,
    );
  } catch (error) {
    if (error.message.includes("SQLITE_ERROR")) {
      console.error(`Insert failed: ${error.message}`);
    } else {
      throw error;
    }
  }
  try {
    console.log(
      `ID: ${(await runPromise(db, invalidInsertBookSQL, titles[1])).lastID} inserted.`,
    );
  } catch (error) {
    if (error.message.includes("SQLITE_ERROR")) {
      console.error(`Insert failed: ${error.message}`);
    } else {
      throw error;
    }
  }
  try {
    console.log(
      `ID: ${(await runPromise(db, invalidInsertBookSQL, titles[2])).lastID} inserted.`,
    );
  } catch (error) {
    if (error.message.includes("SQLITE_ERROR")) {
      console.error(`Insert failed: ${error.message}`);
    } else {
      throw error;
    }
  }
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
