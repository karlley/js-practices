#!/usr/bin/env node
import {
  runPromise,
  allPromise,
  closePromise,
  runMultiplePromise,
} from "../db/promiseFunctions.js";
import {
  createTableSQL,
  invalidInsertBookSQL,
  invalidFetchBookSQL,
  deleteTableSQL,
} from "../db/queries.js";
import { titles } from "../db/constants.js";

async function main() {
  await runPromise(createTableSQL);

  try {
    const insertedBooks = await runMultiplePromise(
      invalidInsertBookSQL,
      titles,
    );
    if (insertedBooks.length === 0) {
      console.log("Books not found.");
    } else {
      insertedBooks.forEach((insertedBook) => {
        console.log(`ID: ${insertedBook.lastID} created.`);
      });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }

  try {
    const fetchedBooks = await allPromise(invalidFetchBookSQL);
    if (fetchedBooks.length === 0) {
      console.log("Books not found.");
    } else {
      fetchedBooks.forEach((fetchedBook) => {
        console.log(`ID: ${fetchedBook.id}, Title: ${fetchedBook.title}`);
      });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }

  await runPromise(deleteTableSQL);
  await closePromise();
}

main();
