#!/usr/bin/env node

import { db } from "./db/database.js";
import {
  createTableSQL,
  invalidInsertBookSQL,
  invalidSelectBookSQL,
  dropTableSQL,
} from "./db/queries.js";
import { titles } from "./db/titles.js";

function main() {
  db.run(createTableSQL, () => {
    db.run(invalidInsertBookSQL, titles[0], function (error) {
      if (error) {
        console.error(`Insert failed: ${error.message}`);
      } else {
        console.log(`ID: ${this.lastID} inserted.`);
      }

      db.run(invalidInsertBookSQL, titles[1], function (error) {
        if (error) {
          console.error(`Insert failed: ${error.message}`);
        } else {
          console.log(`ID: ${this.lastID} inserted.`);
        }

        db.run(invalidInsertBookSQL, titles[2], function (error) {
          if (error) {
            console.error(`Insert failed: ${error.message}`);
          } else {
            console.log(`ID: ${this.lastID} inserted.`);
          }

          db.all(invalidSelectBookSQL, (error, books) => {
            if (error) {
              console.error(`Select failed: ${error.message}`);
            } else {
              books.forEach((book) => {
                console.log(`ID: ${book.id}, Title: ${book.title}`);
              });
            }
            db.run(dropTableSQL, () => {
              db.close();
            });
          });
        });
      });
    });
  });
}

main();
