#!/usr/bin/env node

import { db } from "./db/database.js";
import {
  createTableSQL,
  insertBookSQL,
  selectBookSQL,
  dropTableSQL,
} from "./db/queries.js";
import { titles } from "./db/titles.js";

function main() {
  db.run(createTableSQL, () => {
    db.run(insertBookSQL, titles[0], function () {
      console.log(`ID: ${this.lastID} inserted.`);

      db.run(insertBookSQL, titles[1], function () {
        console.log(`ID: ${this.lastID} inserted.`);

        db.run(insertBookSQL, titles[2], function () {
          console.log(`ID: ${this.lastID} inserted.`);

          db.all(selectBookSQL, (_, books) => {
            books.forEach((book) => {
              console.log(`ID: ${book.id}, Title: ${book.title}`);
            });
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
