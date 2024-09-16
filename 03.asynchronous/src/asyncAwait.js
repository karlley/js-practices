#!/usr/bin/env node
import {
  runPromise,
  allPromise,
  closePromise,
} from "../db/promiseFunctions.js";
import {
  createTableSQL,
  createBooksSQL,
  getBooksSQL,
  deleteTableSQL,
} from "../db/queries.js";

const titles = ["書籍1", "書籍2", "書籍3"];

const createTable = async () => {
  return runPromise(createTableSQL);
};

const createBooks = async (titles, index = 0) => {
  if (titles.length === index) {
    return;
  }

  const result = await runPromise(createBooksSQL, [titles[index]]);
  console.log(`ID: ${result.lastID} created.`);
  return createBooks(titles, index + 1);
};

const getBooks = async () => {
  return allPromise(getBooksSQL);
};

const displayBooks = (books) => {
  books.forEach((book) => {
    console.log(`ID: ${book.id}, Title: ${book.title}`);
  });
};

const deleteTable = async () => {
  return runPromise(deleteTableSQL);
};

const closeDB = async () => {
  return closePromise();
};

async function main() {
  await createTable();
  await createBooks(titles);
  const books = await getBooks();
  displayBooks(books);
  await deleteTable();
  await closeDB();
}

main();
