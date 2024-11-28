#!/usr/bin/env node

import { db } from "./db/database.js";
import {
  createTableQuery,
  insertQuery,
  selectQuery,
  dropTableQuery,
} from "./db/queries.js";
import { titles } from "./db/titles.js";

function main() {
  db.run(createTableQuery, () => {
    const ids = [];
    db.run(insertQuery, titles[0], function () {
      ids.push(this.lastID);
      db.run(insertQuery, titles[1], function () {
        ids.push(this.lastID);
        db.run(insertQuery, titles[2], function () {
          ids.push(this.lastID);
          ids.forEach((id) => {
            console.log(`ID: ${id} inserted.`);
          });
          db.all(selectQuery, (_, books) => {
            books.forEach((book) => {
              console.log(`ID: ${book.id}, Title: ${book.title}`);
            });
            db.run(dropTableQuery, () => {
              db.close();
            });
          });
        });
      });
    });
  });
}

main();
