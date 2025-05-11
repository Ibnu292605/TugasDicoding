// Mendapatkan elemen dari DOM
const bookForm = document.getElementById('bookForm');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

// Menyimpan buku ke local storage
function saveBooks() {
    const incompleteBooks = [];
    const completeBooks = [];

    document.querySelectorAll('#incompleteBookList [data-bookid]').forEach(book => {
        incompleteBooks.push({
            id: book.getAttribute('data-bookid'),
            title: book.querySelector('[data-testid="bookItemTitle"]').innerText,
            author: book.querySelector('[data-testid="bookItemAuthor"]').innerText.replace('Penulis: ', ''),
            year: Number(book.querySelector('[data-testid="bookItemYear"]').innerText.replace('Tahun: ', '')),
            isComplete: false
        });
    });

    document.querySelectorAll('#completeBookList [data-bookid]').forEach(book => {
        completeBooks.push({
            id: book.getAttribute('data-bookid'),
            title: book.querySelector('[data-testid="bookItemTitle"]').innerText,
            author: book.querySelector('[data-testid="bookItemAuthor"]').innerText.replace('Penulis: ', ''),
            year: Number(book.querySelector('[data-testid="bookItemYear"]').innerText.replace('Tahun: ', '')),
            isComplete: true
        });
    });

    // Simpan semua buku dalam satu objek
    const books = {
        incompleteBooks: incompleteBooks,
        completeBooks: completeBooks
    };

    localStorage.setItem('books', JSON.stringify(books));
}

// Menampilkan buku dari local storage
function displayBooks() {
    const books = JSON.parse(localStorage.getItem('books')) || { incompleteBooks: [], completeBooks: [] };

    books.incompleteBooks.forEach(book => addBookToList(book, false));
    books.completeBooks.forEach(book => addBookToList(book, true));
}

// Menambahkan buku ke daftar
function addBookToList(book, isComplete) {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');
    bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
            <button data-testid="bookItemIsCompleteButton">${isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca'}</button>
            <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        </div>
    `;

    if (isComplete) {
        completeBookList.appendChild(bookItem);
    } else {
        incompleteBookList.appendChild(bookItem);
    }

    // Event listener untuk tombol selesai dibaca
    bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => {
        if (isComplete) {
            bookItem.remove();
            addBookToList(book, false);
        } else {
            bookItem.remove();
            addBookToList(book, true);
        }
        saveBooks();
    });

    // Event listener untuk tombol hapus
    bookItem.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => {
        bookItem.remove();
        saveBooks();
    });
}

// Event listener untuk form penambahan buku
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = Number(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const bookId = Number(new Date()).toString(); // Menggunakan timestamp sebagai ID unik
    const book = {
        id: bookId,
        title: title,
        author: author,
        year: year,
        isComplete: isComplete
    };

    addBookToList(book, isComplete);
    saveBooks();
    bookForm.reset(); // Reset form setelah menambahkan buku
});

// Menampilkan buku saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayBooks);
