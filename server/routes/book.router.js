const express = require('express');
const { sendStatus } = require('express/lib/response');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/:id', (req, res) => {
  console.log('Editing for book id:', req.params.id);
  let author = req.body.author;
  let title = req.body.title;

  const queryString = `
    UPDATE "books"
    SET "author"=$1, "title"=$2
    WHERE "id"=$3
    `;
  pool.query(queryString, [author, title, req.params.id])
    .then(response => {
      res.sendStatus(201);
    }).catch(error => {
      console.log("Error editing:", error);
      res.sendStatus(500);
    })
});

router.put('/read/:id', (req, res) => {
  console.log('Updating read status for id:', req.params.id);
  let newStatus = true;
  if (req.body.currentStatus === 'true') {
    newStatus = false;
  }
  console.log('Status to update from:', req.body.currentStatus);
  console.log('New status:', newStatus);
  const queryText = `UPDATE "books" 
                     SET "isRead"=$1
                     WHERE "id"=$2`;
  pool.query(queryText, [newStatus, req.params.id])
  .then(response => {
    res.sendStatus(201);
  }).catch(error => {
    res.sendStatus(500);
  })
});

// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete('/:id',  (req, res) => {
  console.log('Deleting book at id:', req.params.id);
  const queryText = `DELETE FROM "books" WHERE "id"=$1;`;
  pool.query(queryText, [req.params.id])
  .then((response) => {
    res.sendStatus(204);
  })
  .catch((error) => {
    console.log('Error in book /delete', error);
    res.sendStatus(500);
  });
});

module.exports = router;
