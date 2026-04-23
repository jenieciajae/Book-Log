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
  