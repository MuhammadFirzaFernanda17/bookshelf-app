document.addEventListener("DOMContentLoaded", function () {
    const bookshelf = {
        incomplete: [],
        complete: []
    };

    function updateStorage() {
        localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
    }

    function renderBook(book, shelf) {
    const bookList = document.getElementById(`${shelf}BookshelfList`);
    const bookItem = document.createElement("div");
    bookItem.classList.add("book_item");
    bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="book_item_actions">
            ${shelf === "incomplete" ? `<button class="complete_btn button" data-id="${book.id}">Selesai dibaca</button>` : ""}
            ${shelf === "complete" ? `<button class="incomplete_btn button" data-id="${book.id}">Belum selesai dibaca</button>` : ""}
            <button class="delete_btn button" data-id="${book.id}">Hapus</button>
            <button class="edit_btn button" data-id="${book.id}">Edit</button>
        </div>
    `;
    bookList.appendChild(bookItem);
}

    function addEventListeners() {
        document.addEventListener("click", function (e) {
            const id = e.target.dataset.id;
            if (e.target.classList.contains("complete_btn")) {
                moveBook(id, "complete");
            } else if (e.target.classList.contains("incomplete_btn")) {
                moveBook(id, "incomplete");
            } else if (e.target.classList.contains("delete_btn")) {
                deleteBook(id);
            } else if (e.target.classList.contains("edit_btn")) {
                editBook(id);
            } else if (e.target.id === "showAllBooks") {
                showAllBooks();
            }
        });

        document.getElementById("searchBook").addEventListener("submit", function (e) {
            e.preventDefault();
            const searchTerm = document.getElementById("searchBookTitle").value.toLowerCase();
            searchBooks(searchTerm);
        });
    }

    function addBookToShelf(title, author, year, isComplete) {
        const newBook = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete
        };
        if (isComplete) {
            bookshelf.complete.push(newBook);
            renderBook(newBook, "complete");
        } else {
            bookshelf.incomplete.push(newBook);
            renderBook(newBook, "incomplete");
        }
        updateStorage();
    }

    function moveBook(id, targetShelf) {
        const sourceShelf = targetShelf === "complete" ? "incomplete" : "complete";
        const index = bookshelf[sourceShelf].findIndex(book => book.id == id);
        const book = bookshelf[sourceShelf][index];
        bookshelf[sourceShelf].splice(index, 1);
        book.isComplete = !book.isComplete;
        bookshelf[targetShelf].push(book);
        updateStorage();
        render();
    }

    function deleteBook(id) {
        if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
            const shelf = bookshelf.incomplete.find(book => book.id == id) ? "incomplete" : "complete";
            const index = bookshelf[shelf].findIndex(book => book.id == id);
            bookshelf[shelf].splice(index, 1);
            updateStorage();
            render();
        }
    }

    function editBook(id) {
        const shelf = bookshelf.complete.find(book => book.id == id) ? "complete" : "incomplete";
        const index = bookshelf[shelf].findIndex(book => book.id == id);
        const book = bookshelf[shelf][index];
        const newTitle = prompt("Masukkan judul baru:", book.title);
        const newAuthor = prompt("Masukkan penulis baru:", book.author);
        const newYear = parseInt(prompt("Masukkan tahun baru:", book.year));
        if (newTitle && newAuthor && newYear) {
            book.title = newTitle;
            book.author = newAuthor;
            book.year = newYear;
            updateStorage();
            render();
        }
    }

    function searchBooks(searchTerm) {
        const allBooks = [...bookshelf.incomplete, ...bookshelf.complete];
        const filteredBooks = allBooks.filter(book => book.title.toLowerCase().includes(searchTerm));
        if (filteredBooks.length > 0) {
            const location = filteredBooks[0].isComplete ? "Selesai dibaca" : "Belum selesai dibaca";
            alert(`Buku berada di daftar "${location}"`);
            renderFilteredBooks(filteredBooks);
        } else {
            alert("Buku Tidak Ada");
        }
    }

    function renderFilteredBooks(filteredBooks) {
        const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
        const completeBookshelfList = document.getElementById("completeBookshelfList");
        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";
        filteredBooks.forEach(book => {
            if (book.isComplete) {
                renderBook(book, "complete");
            } else {
                renderBook(book, "incomplete");
            }
        });
    }

    function showAllBooks() {
        render();
    }

    function render() {
        const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
        const completeBookshelfList = document.getElementById("completeBookshelfList");
        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";
        bookshelf.incomplete.forEach(book => renderBook(book, "incomplete"));
        bookshelf.complete.forEach(book => renderBook(book, "complete"));
    }

    document.getElementById("inputBook").addEventListener("submit", function (e) {
        e.preventDefault();
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = parseInt(document.getElementById("inputBookYear").value);
        const isComplete = document.getElementById("inputBookIsComplete").checked;
        addBookToShelf(title, author, year, isComplete);
        this.reset();
    });

    const storedData = localStorage.getItem("bookshelf");
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        bookshelf.incomplete = parsedData.incomplete || [];
        bookshelf.complete = parsedData.complete || [];
        render();
    }
    addEventListeners();
});
