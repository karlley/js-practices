#!/usr/bin/env node

import { db } from "./db/database.js";
import {
  createTableQuery,
  invalidInsertQuery,
  invalidSelectQuery,
  dropTableQuery,
} from "./db/queries.js";
import { titles } from "./db/titles.js";

function main() {
  db.run(createTableQuery, () => {
    const ids = [];
    db.run(invalidInsertQuery, titles[0], function (error) {
      if (error) {
        console.error(`Insert failed: ${error}`);
      } else {
        ids.push(this.lastID);
      }
      db.run(invalidInsertQuery, titles[1], function (error) {
        if (error) {
          console.error(`Insert failed: ${error}`);
        } else {
          ids.push(this.lastID);
        }
        db.run(invalidInsertQuery, titles[2], function (error) {
          if (error) {
            console.error(`Insert failed: ${error}`);
          } else {
            ids.push(this.lastID);
          }
          ids.forEach((id) => {
            console.log(`ID: ${id} inserted.`);
          });
          db.all(invalidSelectQuery, (error, books) => {
            if (error) {
              console.error(`Select failed: ${error}`);
            } else {
              books.forEach((book) => {
                console.log(`ID: ${book.id}, Title: ${book.title}`);
              });
            }
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
