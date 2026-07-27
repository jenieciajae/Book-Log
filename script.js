// ==========================================
// Jeniecia's Book Log
// Main JavaScript File
// ==========================================
import {
  db,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "./firebase.js";
document.addEventListener("DOMContentLoaded", () => {

  console.log("Book Log Loaded");

  setupBookSearch();

  setupNavigation();

  loadStats();

  displayBooks();

  displayMyReviews();

  displayCommunityReviews();

  setupReviewForm();

  setupReviewSorting();

  setupReviewSearch();
	
  setupLoadMoreReviews();
	
  setupReviewModals();

});
// ==========================================
// Global Variables
// ==========================================

const API_KEY = "AIzaSyBRkq3tklIGizMW6zd5OmSl3zgkk25xOhM";

let books = JSON.parse(localStorage.getItem("books")) || [];
let reviewToDelete = null;
let reviewToEdit = null;
let reviewsToShow = 6;

// ==========================================
// Toast Notifications
// ==========================================

function showToast(message) {

  const toast = document.createElement("div");

  toast.className = "toast";

  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {

    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);

  }, 2500);

}
// ==========================================
// Featured Reviews
// ==========================================

const featuredReviews = [
  {
    title: "Men Who Hate Women",
    rating: 9
  },
  {
    title: "Book Lovers",
    rating: 8.6
  },
  {
    title: "Notes from Underground",
    rating: 8.8
  },
  {
    title: "The Bell Jar",
    rating: 9
  }
];

// ==========================================
// Book Search
// ==========================================

function setupBookSearch() {
  const searchForm = document.getElementById("searchForm");

  if (!searchForm) return;

  searchForm.addEventListener("submit", searchBooks);
}

async function searchBooks(e) {
  e.preventDefault();

  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("searchResults");

  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter a search.</p>";
    return;
  }

  resultsDiv.innerHTML = `
  <div class="spinner-container">
    <div class="spinner"></div>
    <p>Finding books...</p>
  </div>
`;

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&maxResults=12&key=${API_KEY}`
    );

    const data = await response.json();

    displaySearchResults(data.items, resultsDiv);

  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML =
      "<p>Something went wrong. Please try again.</p>";
  }
}

function displaySearchResults(items, container) {
  container.innerHTML = "";

  if (!items || items.length === 0) {

  container.innerHTML = `
    <div class="empty-search">
      <h3>No Books Found</h3>
      <p>
        Try searching for a different title or author.
      </p>
    </div>
  `;

  return;

}

  items.forEach((book) => {
    const title = book.volumeInfo.title || "Unknown Title";

    const author = book.volumeInfo.authors
      ? book.volumeInfo.authors.join(", ")
      : "Unknown Author";

    const cover =
      book.volumeInfo.imageLinks?.thumbnail ||
      "https://via.placeholder.com/128x195?text=No+Cover";

    const link =
      book.volumeInfo.infoLink ||
      book.volumeInfo.previewLink ||
      "#";

    const card = document.createElement("div");
    card.classList.add("book-card");

    card.innerHTML = `
      <img src="${cover}" alt="${title}">
      <h3>${title}</h3>
      <p>${author}</p>

      <div class="book-actions">

  <select class="book-status">
    <option value="want">Want to Read</option>
    <option value="reading">Currently Reading</option>
    <option value="finished">Finished</option>
  </select>

  <div class="book-buttons">
    <a href="${link}" target="_blank">View Book</a>
    <button class="add-book-btn">Add to Library</button>
  </div>

</div>
    `;

    const statusSelect = card.querySelector(".book-status");

card
  .querySelector(".add-book-btn")
  .addEventListener("click", () => {

    addBookToLibrary({
      title,
      author,
      cover,
      status: statusSelect.value
    });

  });

    container.appendChild(card);
  });
}

// ==========================================
// Library
// ==========================================

function displayBooks() {

  const reading = document.getElementById("readingContainer");
  const want = document.getElementById("wantContainer");
  const finished = document.getElementById("finishedContainer");

  if (!reading || !want || !finished) return;

  reading.innerHTML = "";
  want.innerHTML = "";
  finished.innerHTML = "";

  displayBookSection(
    books.filter(book => book.status === "reading"),
    reading,
    "&#128214; Nothing here yet",
    "Start reading a book to see it here."
  );

  displayBookSection(
    books.filter(book => book.status === "want"),
    want,
    "&#128218; Your TBR is empty",
    "Search for books and add them to your library."
  );

  displayBookSection(
    books.filter(book => book.status === "finished"),
    finished,
    "&#127881; No finished books yet",
    "Your completed books will appear here."
  );

}

function displayBookSection(bookList, container, heading, message) {

  // Show empty state if no books exist
  if (bookList.length === 0) {

    container.innerHTML = `
      <div class="empty-library">
        <h4>${heading}</h4>
        <p>${message}</p>
      </div>
    `;

    return;

  }

  // Display books
  bookList.forEach(book => {

    const index = books.indexOf(book);

    container.innerHTML += `
      <div class="added-book">

        <img src="${book.cover}" alt="${book.title}">

        <h4>${book.title}</h4>

        <p>${book.author}</p>

        <div class="library-buttons">

          <button
            class="edit-btn"
            data-index="${index}">
            Edit
          </button>

          <button
            class="delete-btn"
            data-index="${index}">
            Delete
          </button>

        </div>

      </div>
    `;

  });

  // Delete buttons
  container.querySelectorAll(".delete-btn").forEach((button) => {

    button.addEventListener("click", () => {

      deleteBook(Number(button.dataset.index));

    });

  });

  // Edit buttons
  container.querySelectorAll(".edit-btn").forEach((button) => {

    button.addEventListener("click", () => {

      editBook(Number(button.dataset.index));

    });

  });

}

// ==========================================
// Add Book
// ==========================================

function addBookToLibrary(book) {

  const alreadyExists = books.some(
    (b) =>
      b.title === book.title &&
      b.author === book.author
  );

  if (alreadyExists) {
    showToast("This book is already in your library.");
    return;
  }

  books.push(book);

  localStorage.setItem(
    "books",
    JSON.stringify(books)
  );

  displayBooks();

  showToast(`${book.title} added to your library!`);

}

// ==========================================
// Delete Book
// ==========================================

function deleteBook(index) {

  if (!confirm("Delete this book?")) return;

  books.splice(index, 1);

  localStorage.setItem(
    "books",
    JSON.stringify(books)
  );

  displayBooks();

}

// ==========================================
// Edit Book
// ==========================================

function editBook(index) {

  const book = books[index];

  const newStatus = prompt(
    "Enter a new status:\n\nwant\nreading\nfinished",
    book.status
  );

  if (!newStatus) return;

  const status = newStatus.toLowerCase();

  if (
    status !== "want" &&
    status !== "reading" &&
    status !== "finished"
  ) {
    alert("Invalid status.");
    return;
  }

  book.status = status;

  localStorage.setItem(
    "books",
    JSON.stringify(books)
  );

  displayBooks();

}
// ==========================================
// Reviews
// ==========================================

async function deleteReview(id) {

  if(!id) return;


  await deleteDoc(
    doc(db, "communityReviews", id)
  );


  showToast("Review deleted!");


  displayCommunityReviews();

  loadStats();

}

function showDeleteModal(id) {

  reviewToDelete = id;

  const modal =
  document.getElementById("deleteModal");

  if(modal){
    modal.classList.add("show");
  }

}


function hideDeleteModal(){

  const modal =
  document.getElementById("deleteModal");

  if(modal){
    modal.classList.remove("show");
  }

}


function showEditModal(id){

  reviewToEdit = id;


  const review = communityReviews.find(
    review => review.id === id
  );


  if(!review) return;


  document.getElementById("editRating").value =
  review.rating;


  document.getElementById("editText").value =
  review.review;


  document
  .getElementById("editModal")
  .classList.add("show");

}


function hideEditModal(){

  const modal =
  document.getElementById("editModal");

  if(modal){
    modal.classList.remove("show");
  }

}

function setupReviewModals(){

  const cancelDelete =
  document.getElementById("cancelDelete");

  const confirmDelete =
  document.getElementById("confirmDelete");

  const cancelEdit =
  document.getElementById("cancelEdit");

  const saveEdit =
  document.getElementById("saveEdit");


  if(cancelDelete){

    cancelDelete.addEventListener("click", () => {

      hideDeleteModal();

    });

  }


  if(confirmDelete){

    confirmDelete.addEventListener("click", () => {

      deleteReview(reviewToDelete);

      hideDeleteModal();

    });

  }


  if(cancelEdit){

    cancelEdit.addEventListener("click", () => {

      hideEditModal();

    });

  }


  if(saveEdit){

    saveEdit.addEventListener("click", async () => {


      const rating =
      document.getElementById("editRating").value;


      const text =
      document.getElementById("editText").value;


      await updateDoc(
        doc(db, "communityReviews", reviewToEdit),
        {
          rating: Number(rating),
          review: text
        }
      );


      hideEditModal();

      showToast("Review updated! ✏️");

      displayCommunityReviews();

      loadStats();


    });

  }

}

function setupLoadMoreReviews(){

  const button =
  document.getElementById("loadMoreReviews");


  if(!button) return;


  button.addEventListener("click", () => {


    reviewsToShow += 6;


    displayCommunityReviews();


    if(reviewsToShow >= communityReviews.length){

      button.style.display = "none";

    }


  });

}

const myReviews = [

{
title: "Men Who Hate Women",
author: "Laura Bates",
username: "Jeniecia Williams",
rating: 9,
review:
"A powerful and eye-opening look into online misogyny and how digital communities can influence real-world harm."
},

{
title: "Book Lovers",
author: "Emily Henry",
username: "Jeniecia Williams",
rating: 8.6,
review:
"Truly a book for book lovers about book lovers. One of my favorite romance books so far, just such a cute book! "
},

{
title: "The Bell Jar",
author: "Sylvia Plath",
username: "Jeniecia Williams",
rating: 9,
review:
"A beautifully written exploration of identity, expectations, and the complicated experience of mental health."
},

{
title: "The Metamorphosis",
author: "Franz Kafka",
username: "Jeniecia Williams",
rating: 9.5,
review:
"A great story about identity and the pressure of being successful. Kafka demonstrates what happens when a person is reduced to what they can offer instead of who they are."
}

];



let communityReviews = [];



function displayMyReviews(){

  const container =
    document.getElementById("myReviewsContainer");


  if(!container) return;


  container.innerHTML = "";


  myReviews.forEach(review => {

    container.innerHTML += `

      <div class="review-card">

        <h3>${review.title}</h3>

        <p>Reviewed by: ${review.username}</p>

	  	<p>${review.author}</p>

        <strong>${review.rating}/10</strong>

        <p>${review.review}</p>

      </div>

    `;

  });

}



async function displayCommunityReviews(){

  const container =
  document.getElementById("communityReviewsContainer");


  if(!container) return;


  container.innerHTML = `
    <p>Loading reviews...</p>
  `;


  communityReviews = [];


  const querySnapshot = await getDocs(
    collection(db, "communityReviews")
  );


  querySnapshot.forEach((doc) => {

    communityReviews.push({
      id: doc.id,
      ...doc.data()
    });

  });


  container.innerHTML = "";


  if(communityReviews.length === 0){

    container.innerHTML =
    "<p>No community reviews yet. Be the first!</p>";

    return;

  }


  communityReviews
	.slice(0, reviewsToShow)
	.forEach(review => {

    const currentUser =
    localStorage.getItem("username");


    container.innerHTML += `

      <div class="review-card">

        <h3>${review.title}</h3>

        <p>
        <strong>Reviewed by:</strong> 
        ${review.username}
        </p>

        <p>${review.author}</p>

        <strong>
        ${review.rating}/10 ⭐
        </strong>

        <p>${review.review}</p>


        <button
        class="helpful-btn"
        data-id="${review.id}">
        ❤️ Helpful (${review.helpful || 0})
        </button>


        ${review.username === currentUser ? `

        <div class="review-buttons">

          <button
          class="edit-review-btn"
          data-id="${review.id}">
          Edit
          </button>


          <button
          class="delete-review-btn"
          data-id="${review.id}">
          Delete
          </button>

        </div>

        ` : ""}


      </div>

    `;

  });


  document.querySelectorAll(".delete-review-btn")
  .forEach(button => {

    button.addEventListener("click", () => {

      showDeleteModal(button.dataset.id);

    });

  });


  document.querySelectorAll(".edit-review-btn")
  .forEach(button => {

    button.addEventListener("click", () => {

      showEditModal(button.dataset.id);

    });

  });


  document.querySelectorAll(".helpful-btn")
  .forEach(button => {

    button.addEventListener("click", () => {

      addHelpful(button.dataset.id);

    });

  });

}



async function addHelpful(id){

  const review = communityReviews.find(
    review => review.id === id
  );


  if(!review) return;


  await updateDoc(
    doc(db, "communityReviews", id),
    {
      helpful: (review.helpful || 0) + 1
    }
  );


  showToast("Marked as helpful! ❤️");


  displayCommunityReviews();

}

async function setupReviewForm(){


const form =
document.getElementById("reviewForm");


if(!form) return;



form.addEventListener("submit", async function(e){


e.preventDefault();



const newReview = {

  username:
  document.getElementById("reviewUsername").value,

  title:
  document.getElementById("reviewTitle").value,

  author:
  document.getElementById("reviewAuthor").value,

  rating:
  Number(document.getElementById("reviewRating").value),

  review:
  document.getElementById("reviewText").value,

  helpful: 0

};

// Remember this user on this browser
localStorage.setItem(
  "username",
  newReview.username
);

// Save review to Firebase
await addDoc(
  collection(db, "communityReviews"),
  newReview
);



// Reload reviews

displayCommunityReviews();



form.reset();


showToast("Review submitted! 🎉");


});


}
// ==========================================
// Review Sorting
// ==========================================
function setupReviewSearch(){

  const search =
  document.getElementById("reviewSearch");


  if(!search) return;


  search.addEventListener("input", () => {

    const value =
    search.value.toLowerCase();


    const filtered =
    communityReviews.filter(review => {


      return (

  		(review.title || "").toLowerCase().includes(value) ||

  		(review.author || "").toLowerCase().includes(value) ||

  		(review.username || "").toLowerCase().includes(value)

	);


    });


    displayFilteredReviews(filtered);


  });

}
function displayFilteredReviews(reviews){

  const container =
  document.getElementById("communityReviewsContainer");


  container.innerHTML = "";


  if(reviews.length === 0){

    container.innerHTML =
    "<p>No reviews found.</p>";

    return;

  }


  reviews.forEach(review => {

    container.innerHTML += `

    <div class="review-card">

      <h3>${review.title}</h3>

      <p>
      <strong>Reviewed by:</strong>
      ${review.username}
      </p>

      <p>${review.author}</p>

      <strong>
      ${review.rating}/10 ⭐
      </strong>

      <p>${review.review}</p>


      <button
      class="helpful-btn"
      data-id="${review.id}">
      ❤️ Helpful (${review.helpful || 0})
      </button>


    </div>

    `;

  });

}
function setupReviewSorting(){

  const sortSelect = document.getElementById("reviewSort");

  if(!sortSelect) return;


  sortSelect.addEventListener("change", () => {

    const option = sortSelect.value;


    sortReviews(
      "myReviewsContainer",
      option
    );


    sortReviews(
      "communityReviewsContainer",
      option
    );

  });

}



function sortReviews(containerID, option){

  const container = document.getElementById(containerID);

  if(!container) return;


  const cards = Array.from(
    container.querySelectorAll(".review-card")
  );


  cards.sort((a,b)=>{


    const titleA = a.querySelector("h3")
      .textContent
      .toLowerCase();


    const titleB = b.querySelector("h3")
      .textContent
      .toLowerCase();



    const ratingA = parseFloat(
      a.querySelector("strong")
      .textContent
    );


    const ratingB = parseFloat(
      b.querySelector("strong")
      .textContent
    );



    if(option === "highest"){
      return ratingB - ratingA;
    }


    if(option === "lowest"){
      return ratingA - ratingB;
    }


    if(option === "az"){
      return titleA.localeCompare(titleB);
    }


    if(option === "za"){
      return titleB.localeCompare(titleA);
    }


    return 0;

  });



  cards.forEach(card => {
    container.appendChild(card);
  });

}

// ==========================================
// Reading Stats
// ==========================================

function loadStats() {

  const books =
    JSON.parse(localStorage.getItem("books")) || [];

  const communityReviews =
    JSON.parse(localStorage.getItem("communityReviews")) || [];



  const totalBooks = books.length;

  const readingBooks =
    books.filter(book => book.status === "reading").length;

  const finishedBooks =
    books.filter(book => book.status === "finished").length;

  const wantBooks =
    books.filter(book => book.status === "want").length;



  let averageRating = "0.0";

// Combine featured reviews + community reviews
const allRatings = [

  ...featuredReviews.map(review => Number(review.rating)),

  ...communityReviews.map(review => Number(review.rating))

];

if (allRatings.length > 0) {

  const total =
    allRatings.reduce((sum, rating) => sum + rating, 0);

  averageRating =
    (total / allRatings.length).toFixed(1);

}



  const booksRead =
    document.getElementById("booksRead");

  const avgRating =
    document.getElementById("avgRating");

  const currentlyReading =
    document.getElementById("currentlyReading");

  const finished =
    document.getElementById("finishedBooks");

  const want =
	document.getElementById("wantToRead");



  if (booksRead)
  	booksRead.textContent = finishedBooks;

  if (avgRating)
    avgRating.textContent = averageRating;

  if (currentlyReading)
    currentlyReading.textContent = readingBooks;

  if (finished)
    finished.textContent = finishedBooks;

  if (want)
    want.textContent = wantBooks;

}

// ==========================================
// Mobile Navigation
// ==========================================

function setupNavigation() {

  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll("#navMenu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });

}