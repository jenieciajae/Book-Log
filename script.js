// script.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS is running");

  // -------------------------------
  // Search Form Functionality
  // -------------------------------
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
        const API_KEY = "AIzaSyBRkq3tklIGizMW6zd5OmSl3zgkk25xOhM"; // Replace if needed
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

          // Create a book card as a link (<a>) for scroll compatibility
          const bookLink = document.createElement("a");
          bookLink.href = "#"; // or wherever you want
          bookLink.classList.add("book-card");
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

  // -------------------------------
  // Scroll Arrows Functionality
  // -------------------------------
  function initScrollArrows() {
    document.querySelectorAll(".read-scroll-wrapper").forEach((wrapper) => {
      const leftBtn = wrapper.querySelector(".scroll-btn.left");
      const rightBtn = wrapper.querySelector(".scroll-btn.right");
      const bookFlex = wrapper.querySelector(".book-flex");

      if (!bookFlex) return;

      // dynamically calculate book width when clicked
      leftBtn.addEventListener("click", () => {
        if (bookFlex.children.length > 0) {
          const gap = parseInt(getComputedStyle(bookFlex).gap) || 20;
          const width = bookFlex.children[0].offsetWidth + gap;
          bookFlex.scrollBy({ left: -width, behavior: "smooth" });
        }
      });

      rightBtn.addEventListener("click", () => {
        if (bookFlex.children.length > 0) {
          const gap = parseInt(getComputedStyle(bookFlex).gap) || 20;
          const width = bookFlex.children[0].offsetWidth + gap;
          bookFlex.scrollBy({ left: width, behavior: "smooth" });
        }
      });
    });
  }

  // Initialize scroll arrows on page load
  initScrollArrows();

  // Optional: Re-initialize if books are added dynamically later
  // You can call initScrollArrows() again after adding new books
});