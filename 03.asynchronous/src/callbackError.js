#!/usr/bin/env node
import sqlite3 from "sqlite3";
import {
  createTableSQL,
  invalidInsertBookSQL,
  invalidFetchBookSQL,
  deleteTableSQL,
} from "../db/queries.js";

const db = new sqlite3.Database(":memory:");
const titles = ["書籍1", "書籍2", "書籍3"];

function main(titles) {
  db.run(createTableSQL, () => {
    let createdCount = 0;
    for (let index = 0; index < titles.length; index++) {
      db.run(invalidInsertBookSQL, titles[index], function (error) {
        if (error) {
          console.error(`Error: ${error.message}`);
        } else {
          console.log(`ID: ${this.lastID} created.`);
        }
        createdCount++;

        if (createdCount === titles.length) {
          db.all(invalidFetchBookSQL, (error, books) => {
            if (error) {
              console.error(`Error: ${error.message}`);
            } else {
              books.forEach((book) => {
                console.log(`ID: ${book.id}, Title: ${book.title}`);
              });
            }
            db.run(deleteTableSQL, () => {
              db.close();
            });
          });
        }
      });
    }
  });
}

main(titles);
