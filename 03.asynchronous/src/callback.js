#!/usr/bin/env node
import sqlite3 from "sqlite3";
import {
  createTableSQL,
  insertBookSQL,
  fetchBookSQL,
  deleteTableSQL,
} from "../db/queries.js";

const db = new sqlite3.Database(":memory:");
const titles = ["書籍1", "書籍2", "書籍3"];

function main(titles) {
  db.run(createTableSQL, () => {
    let createdCount = 0;
    for (let index = 0; index < titles.length; index++) {
      db.run(insertBookSQL, titles[index], function () {
        console.log(`ID: ${this.lastID} created.`);
        createdCount++;

        if (createdCount === titles.length) {
          db.all(fetchBookSQL, (_, books) => {
            books.forEach((book) => {
              console.log(`ID: ${book.id}, Title: ${book.title}`);
            });
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
