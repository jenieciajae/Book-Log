// JavaScript Document

// Function to search books from Open Library API
async function searchBooks() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return; // don’t search empty queries

  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    displayBooks(data.docs);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Function to display books on the page
function displayBooks(books) {
  const container = document.querySelector(".book-container");
  container.innerHTML = "";

  if (!books || books.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  books.slice(0, 6).forEach(book => {
    const bookCard = `
      <div class="book-card">
        <h3>${book.title}</h3>
        <p>${book.author_name ? book.author_name[0] : "Unknown Author"}</p>
      </div>
    `;
    container.innerHTML += bookCard;
  });
}