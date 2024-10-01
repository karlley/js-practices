#!/usr/bin/env node
import { db } from "../db/database.js";
import {
  createTableSQL,
  invalidInsertBookSQL,
  invalidFetchBookSQL,
  deleteTableSQL,
} from "../db/queries.js";
import { titles } from "../db/constants.js";

function main() {
  db.run(createTableSQL, () => {
    let createdCount = 0;
    for (let index = 0; index < titles.length; index++) {
      db.run(invalidInsertBookSQL, titles[index], function (error) {
        if (error) {
          console.error(`Insert failed: ${error.message}`);
        } else {
          console.log(`ID: ${this.lastID} created.`);
        }
        createdCount++;

        if (createdCount === titles.length) {
          db.all(invalidFetchBookSQL, (error, books) => {
            if (error) {
              console.error(`Fetch failed: ${error.message}`);
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

main();
