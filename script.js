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
          bookLink.href = "#";
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

  // Scroll Arrows 
  const wrappers = document.querySelectorAll(".read-scroll-wrapper");

  wrappers.forEach(wrapper => {
    const bookFlex = wrapper.querySelector(".book-flex");
    const leftBtn = wrapper.querySelector(".scroll-btn.left");
    const rightBtn = wrapper.querySelector(".scroll-btn.right");

    if (!bookFlex) return;

    const firstBook = bookFlex.querySelector("a");
    const gap = 20;
    const scrollAmount = firstBook ? firstBook.offsetWidth + gap : 100;

    if (leftBtn) {
      leftBtn.addEventListener("click", () => {
        bookFlex.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });
    }

    if (rightBtn) {
      rightBtn.addEventListener("click", () => {
        bookFlex.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    }
  });
});