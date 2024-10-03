#!/usr/bin/env node
import { db } from "../db/database.js";
import {
  createTableSQL,
  insertBookSQL,
  selectBookSQL,
  dropTableSQL,
} from "../db/queries.js";
import { titles } from "../db/titles.js";

function main() {
  db.run(createTableSQL, () => {
    let createdCount = 0;
    for (let index = 0; index < titles.length; index++) {
      db.run(insertBookSQL, titles[index], function () {
        console.log(`ID: ${this.lastID} inserted.`);
        createdCount++;

        if (createdCount === titles.length) {
          db.all(selectBookSQL, (_, books) => {
            books.forEach((book) => {
              console.log(`ID: ${book.id}, Title: ${book.title}`);
            });
            db.run(dropTableSQL, () => {
              db.close();
            });
          });
        }
      });
    }
  });
}

main();
