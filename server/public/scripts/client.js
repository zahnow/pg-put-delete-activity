let editID = undefined;

$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.delete-button', deleteBook);
  $('#bookShelf').on('click', '.read-button', readBook);
  $('#bookShelf').on('click', '.edit-button', editBook);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  if(!editID) {
    let book = {};
    book.author = $('#author').val();
    book.title = $('#title').val();
    addBook(book);
  } else {
    console.log("Edit mode");
    updateBook();
  }
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

function deleteBook(event) {
  const id = $(event.target).data('id');
  console.log(`Deleting book at ${id}`);
  $.ajax({
    type: 'DELETE',
    url: `/books/${id}`
  }).then((response) => {
    refreshBooks();
  }).catch((error) => {
    console.log('Error deleting book:', error);
  })
}

function editBook (event) {
  const id = $(event.target).data('id');
  editID = id;
  console.log(`Editing book at ${id}`);
  let author = $(event.target).parent().prev().prev().prev().text();
  let title = $(event.target).parent().prev().prev().prev().prev().text();
  $('#author').val(author);
  $('#title').val(title);
}

function readBook(event) {
  const id = $(event.target).data('id');
  const currentStatus = $(event.target).data('read');
  console.log(`Updating book at ${id}`);
  $.ajax({
    type: "PUT",
    url: `/books/read/${id}`,
    data: {
      currentStatus: currentStatus
    }
  }).then((response) => {
    refreshBooks();
  }).catch((error) => {
    console.log('Error updating book:', error);
  })
}

function updateBook() {
  const author = $('#author').val();
  const title = $('#title').val();
  const id = editID;
  $.ajax({
    type: 'PUT',
    url: `/books/${id}`,
    data: {
      author: author,
      title: title
    }
  }).then((response) => {
    refreshBooks();
    $('#author').val('');
    $('#title').val('');
    editID = undefined;
  }).catch((error) => {
    console.log('Error updating book:', error);
  })
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td class="title">${book.title}</td>
        <td class="author">${book.author}</td>
        <td>${book.isRead}</td>
        <td><button class="read-button" data-read="${book.isRead}" data-id="${book.id}">Mark As Read</button></td>
        <td><button class="edit-button" data-id="${book.id}">Edit</button></td>
        <td><button class="delete-button" data-id="${book.id}">Delete</button></td>
      </tr>
    `);
  }
}
