// script.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS is running");

  // Book Search
  const searchForm = document.getElementById("searchForm");

  if (searchForm) {
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const query = document.getElementById("searchInput").value.trim();
      const resultsDiv = document.getElementById("searchResults");

      if (!query) {
        resultsDiv.innerHTML = "<p>Please enter something.</p>";
        return;
      }

      resultsDiv.innerHTML = "<p>Loading...</p>";

      try {
        const API_KEY = "AIzaSyBRkq3tklIGizMW6zd5OmSl3zgkk25xOhM"; 
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            query
          )}&maxResults=12&key=${API_KEY}`
        );

        const data = await response.json();

        resultsDiv.innerHTML = "";

        if (!data.items || data.items.length === 0) {
          resultsDiv.innerHTML = "<p>No results found.</p>";
          return;
        }

        data.items.forEach((book) => {
          const title = book.volumeInfo.title || "No title";
          const authors = book.volumeInfo.authors
            ? book.volumeInfo.authors.join(", ")
            : "Unknown author";
          const img =
            book.volumeInfo.imageLinks?.thumbnail ||
            "https://via.placeholder.com/128x195?text=No+Cover";

          const bookLink = document.createElement("a");
bookLink.classList.add("book-card");

// REAL GOOGLE BOOKS LINK
bookLink.href =
  book.volumeInfo.infoLink ||
  book.volumeInfo.previewLink ||
  "#";

bookLink.target = "_blank";
bookLink.rel = "noopener noreferrer";

bookLink.innerHTML = `
  <img src="${img}" alt="${title} cover">
  <h3>${title}</h3>
  <p>${authors}</p>
`;

resultsDiv.appendChild(bookLink);
        });
      } catch (error) {
        console.error("Error:", error);
        resultsDiv.innerHTML =
          "<p>Something went wrong. Try again later.</p>";
      }
    });
  }
});
  

document.addEventListener("DOMContentLoaded", () => {
	console.log("Audiobook search JS loaded");
const form = document.getElementById("audioSearchForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const query = document.getElementById("audioSearchInput").value.trim();
      const resultsDiv = document.getElementById("audioResults");

      if (!query) {
        resultsDiv.innerHTML = "<p>Please enter something.</p>";
        return;
      }

      resultsDiv.innerHTML = "<p>Loading...</p>";

      try {
        const API_KEY = "AIzaSyBRkq3tklIGizMW6zd5OmSl3zgkk25xOhM";

        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query + " audiobook")}&maxResults=12&key=${API_KEY}`
        );

        const data = await response.json();

        resultsDiv.innerHTML = "";

        if (!data.items || data.items.length === 0) {
          resultsDiv.innerHTML = "<p>No audiobooks found.</p>";
          return;
        }

        data.items.forEach((book) => {
          const title = book.volumeInfo.title || "No title";
          const authors = book.volumeInfo.authors
            ? book.volumeInfo.authors.join(", ")
            : "Unknown author";

          const img =
            book.volumeInfo.imageLinks?.thumbnail ||
            "https://via.placeholder.com/128x195?text=No+Cover";

          const link = document.createElement("a");
          link.classList.add("book-card");
          link.href =
            book.volumeInfo.infoLink ||
            book.volumeInfo.previewLink ||
            "#";

          link.target = "_blank";
          link.rel = "noopener noreferrer";

          link.innerHTML = `
            <img src="${img}" alt="${title}">
            <h3>${title}</h3>
            <p>${authors}</p>
          `;

          resultsDiv.appendChild(link);
        });

      } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = "<p>Error loading audiobooks.</p>";
      }
    });
  }

});

// Book data for stats 
document.addEventListener("DOMContentLoaded", function () {

  const books = [
    { title: "Men Who Hate Women", rating: 9 },
    { title: "Book Lovers", rating: 8.8 },
    { title: "Notes from Underground", rating: 7.5 },
    { title: "The Bell Jar", rating: 9 },
    { title: "The Perks of Being a Wallflower", rating: 8.5 },
    { title: "The End of White World Supremacy", rating: 6.5 },
    { title: "The Metamorphosis", rating: 9.5 }
  ];

  function getAverageRating() {
    const total = books.reduce((sum, book) => sum + book.rating, 0);
    return (total / books.length).toFixed(1);
  }

  function getBooksRead() {
    return books.length;
  }

  console.log("Stats running");

  const avgEl = document.getElementById("avgRating");
  const booksEl = document.getElementById("booksRead");

  console.log(avgEl, booksEl);

  if (avgEl) avgEl.textContent = getAverageRating();
  if (booksEl) booksEl.textContent = getBooksRead();

});

document.addEventListener("DOMContentLoaded", function () {

  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll("#navMenu a");

  // toggle menu open/close when hamburger is clicked
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  // close menu
  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");
    });
  });

});