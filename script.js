// script

// Make sure JS runs after page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS is running ✅");

  const searchForm = document.getElementById("searchForm");

  // Only run this code if we're on the search page
  if (searchForm) {
    console.log("Search form found ✅");

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
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        console.log(data); // helps debug

        resultsDiv.innerHTML = "";

        if (!data.items) {
          resultsDiv.innerHTML = "<p>No results found.</p>";
          return;
        }

        data.items.forEach((book) => {
          const title = book.volumeInfo.title || "No title";
          const authors = book.volumeInfo.authors
            ? book.volumeInfo.authors.join(", ")
            : "Unknown author";

          const bookCard = document.createElement("div");
          bookCard.classList.add("book");

          bookCard.innerHTML = `
            <h3>${title}</h3>
            <p>${authors}</p>
          `;

          resultsDiv.appendChild(bookCard);
        });
      } catch (error) {
        console.error("Error:", error);
        resultsDiv.innerHTML = "<p>Something went wrong.</p>";
      }
    });
  }
});