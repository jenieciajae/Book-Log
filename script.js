// script.js

// --------- Submit a Book Page ---------
const submitForm = document.getElementById("submitForm");
if (submitForm) {
  submitForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // Get form values
    const title = document.getElementById("bookTitle").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const notes = document.getElementById("bookNotes").value.trim();

    if (!title || !author) {
      alert("Please enter both a title and an author.");
      return;
    }

    // Create book object
    const book = { title, author, notes };

    // Save to localStorage
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));

    // Clear form
    submitForm.reset();
    alert("Book submitted successfully!");
  });
}

// --------- Search a Book Page ---------
const searchForm = document.getElementById("searchForm");
if (searchForm) {
  searchForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      resultsDiv.innerHTML = "";

      if (!data.items || data.items.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
      }

      data.items.forEach(book => {
        const title = book.volumeInfo.title || "No title";
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown author";
        const html = `
          <div class="book">
            <h3>${title}</h3>
            <p>${authors}</p>
          </div>
        `;
        resultsDiv.innerHTML += html;
      });
    } catch (error) {
      resultsDiv.innerHTML = "<p>Error fetching results. Try again later.</p>";
      console.error(error);
    }
  });
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