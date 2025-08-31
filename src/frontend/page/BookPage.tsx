import { useEffect, useState } from 'react';

type Book = {
  id: number;
  title: string;
};

export default function BookPage() {
  const [books, setBooks] = useState<Book[]>([]);

   useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch('http://localhost:3000/api/books');
      const data: Book[] = await res.json();
      setBooks(data);
    };

    fetchBooks();
  }, []);
    return (
    <div className="books-section">
  <h1>Books</h1>
  <div className="book-items">
    {books.map((b) => (
      <div className="book-card" key={b.id}>
        <img src='https://png.pngtree.com/template/20211102/ourlarge/pngtree-childrens-books-cover-cartoon-template-image_709914.png' width={200} ></img>
        <h3>{b.title}</h3>
        <p>Book ID: {b.id}</p>
      </div>
    ))}
  </div>
</div>

  );
}
