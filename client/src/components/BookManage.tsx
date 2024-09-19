import React, { useState } from 'react';

interface Book {
  sno: number;
  booktitle: string;
  author: string;
  genre: string;
  yop: string;
  isbn: string;
}

const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newBook, setNewBook] = useState<Omit<Book, 'sno'>>({
    booktitle: '',
    author: '',
    genre: '',
    yop: '',
    isbn: '',
  });
  const [editedBook, setEditedBook] = useState<Omit<Book, 'sno'>>({
    booktitle: '',
    author: '',
    genre: '',
    yop: '',
    isbn: '',
  });

  const addBook = () => {
    if (!isAddDisabled) {
      setBooks([...books, { ...newBook, sno: books.length + 1 }]);
      setNewBook({ booktitle: '', author: '', genre: '', yop: '', isbn: '' });
    }
  };

  const editBook = (index: number) => {
    setEditingIndex(index);
    setEditedBook(books[index]); // Set the book being edited
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Omit<Book, 'sno'>
  ) => {
    setEditedBook({ ...editedBook, [field]: e.target.value });
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updatedBooks = [...books];
      updatedBooks[editingIndex] = { ...editedBook, sno: editingIndex + 1 };
      setBooks(updatedBooks);
      setEditingIndex(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const deleteBook = (index: number) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks.map((book, i) => ({ ...book, sno: i + 1 })));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Omit<Book, 'sno'>
  ) => {
    setNewBook({ ...newBook, [field]: e.target.value });
  };

  // Check if any field is empty to disable Add Book button
  const isAddDisabled = Object.values(newBook).some((value) => value.trim() === '');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Management App</h1>

      {/* New book form */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-bold mb-2">Add New Book</h2>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
          <input
            type="text"
            placeholder="Book Title"
            value={newBook.booktitle}
            onChange={(e) => handleInputChange(e, 'booktitle')}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => handleInputChange(e, 'author')}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Genre"
            value={newBook.genre}
            onChange={(e) => handleInputChange(e, 'genre')}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Year of Publishing"
            value={newBook.yop}
            onChange={(e) => handleInputChange(e, 'yop')}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="ISBN"
            value={newBook.isbn}
            onChange={(e) => handleInputChange(e, 'isbn')}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          onClick={addBook}
          className={`bg-blue-500 text-white p-2 rounded ${isAddDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isAddDisabled}
        >
          ➕ Add Book
        </button>
      </div>

      {/* Book list */}
      <div className="overflow-x-auto">
        <table className="w-full mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">S.No</th>
              <th className="p-2">Book Title</th>
              <th className="p-2">Author</th>
              <th className="p-2">Genre</th>
              <th className="p-2">Year of Publishing</th>
              <th className="p-2">ISBN</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.sno} className="border-b">
                {editingIndex === index ? (
                  <>
                    <td className="p-2">{book.sno}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editedBook.booktitle}
                        onChange={(e) => handleEditChange(e, 'booktitle')}
                        className="border p-2 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editedBook.author}
                        onChange={(e) => handleEditChange(e, 'author')}
                        className="border p-2 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editedBook.genre}
                        onChange={(e) => handleEditChange(e, 'genre')}
                        className="border p-2 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editedBook.yop}
                        onChange={(e) => handleEditChange(e, 'yop')}
                        className="border p-2 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editedBook.isbn}
                        onChange={(e) => handleEditChange(e, 'isbn')}
                        className="border p-2 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <button onClick={saveEdit} className="mr-2 text-green-500">
                        💾 Save
                      </button>
                      <button onClick={cancelEdit} className="text-yellow-500">
                        ❌ Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{book.sno}</td>
                    <td className="p-2">{book.booktitle}</td>
                    <td className="p-2">{book.author}</td>
                    <td className="p-2">{book.genre}</td>
                    <td className="p-2">{book.yop}</td>
                    <td className="p-2">{book.isbn}</td>
                    <td className="p-2">
                      <button onClick={() => editBook(index)} className="mr-2 text-blue-500">
                        ✏️ Edit
                      </button>
                      <button onClick={() => deleteBook(index)} className="text-red-500">
                        🗑️ Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookManagement;
