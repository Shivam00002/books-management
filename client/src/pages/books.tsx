import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/ ProtectedRoute";

interface Book {
  _id: string;
  sno: number;
  booktitle: string;
  author: string;
  genre: string;
  yop: string;
  isbn: string;
}

const API_URL = "http://localhost:4000";

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBook, setNewBook] = useState<Omit<Book, "_id" | "sno">>({
    booktitle: "",
    author: "",
    genre: "",
    yop: "",
    isbn: "",
  });
  const [editedBook, setEditedBook] = useState<Omit<Book, "_id" | "sno">>({
    booktitle: "",
    author: "",
    genre: "",
    yop: "",
    isbn: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("t ffor token", token);
      const response = await fetch(`${API_URL}/books`, {
        method: "GET",
        headers: {
          Authorization: token || "",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError("An error occurred while fetching books");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addBook = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/books`,
        {
          title: newBook.booktitle,
          author: newBook.author,
          genre: newBook.genre,
          yearOfPublishing: newBook.yop,
          isbn: newBook.isbn,
        },
        {
          headers: {
            Authorization: token || "",
          },
        }
      );
      setBooks([...books, response.data]);
      setNewBook({ booktitle: "", author: "", genre: "", yop: "", isbn: "" });
      router.push(router.asPath, undefined, { scroll: false });
    } catch (error) {
      console.error("Error adding book:", error);
      setError("Failed to add book. Please try again.");
    }
  };

  const saveEdit = async () => {
    if (editingId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${API_URL}/books/${editingId}`,
          {
            title: editedBook.booktitle,
            author: editedBook.author,
            genre: editedBook.genre,
            yearOfPublishing: editedBook.yop,
            isbn: editedBook.isbn,
          },
          {
            headers: {
              Authorization: token || "",
            },
          }
        );
        setBooks(
          books.map((book) => (book._id === editingId ? response.data : book))
        );
        setEditingId(null);
        router.push(router.asPath, undefined, { scroll: false });
      } catch (error) {
        console.error("Error updating book:", error);
        setError("Failed to update book. Please try again.");
      }
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/books/${id}`, {
        headers: {
          Authorization: token || "",
        },
      });
      setBooks(books.filter((book) => book._id !== id));
      router.push(router.asPath, undefined, { scroll: false });
    } catch (error) {
      console.error("Error deleting book:", error);
      setError("Failed to delete book. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Omit<Book, "_id" | "sno">
  ) => {
    setNewBook({ ...newBook, [field]: e.target.value });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Omit<Book, "_id" | "sno">
  ) => {
    setEditedBook({ ...editedBook, [field]: e.target.value });
  };

  const isAddDisabled = Object.values(newBook).some(
    (value) => value.trim() === ""
  );

  return (
    <ProtectedRoute>
      <div>
        <Head>
          <title>Book Management - Your Library</title>
          <meta
            name="description"
            content="Manage your book collection with our easy-to-use interface. Add, edit, and delete books effortlessly."
          />
          <meta
            name="keywords"
            content="book management, library, reading list, book collection"
          />
          <link rel="canonical" href="https://yourdomain.com/books" />
        </Head>
        <div className="container mx-auto p-4 bg-white dark:bg-slate-950 transition-colors duration-500">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Book Management
          </h1>

          {/* Add new book section */}
          <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mb-4">
            <h2 className="text-md font-bold mb-2 text-gray-600 dark:text-gray-200">
              Add new book
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
              {Object.keys(newBook).map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newBook[field as keyof typeof newBook]}
                  onChange={(e) =>
                    handleInputChange(e, field as keyof typeof newBook)
                  }
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:text-gray-300"
                />
              ))}
            </div>
            <button
              onClick={addBook}
              disabled={isAddDisabled}
              className={`bg-blue-500 text-white p-2 rounded ${
                isAddDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              ➕ Add Book
            </button>
          </div>

          {/* Display books */}
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-800">
                    <th className="p-2 text-left">S.No</th>
                    <th className="p-2 text-left">Book Title</th>
                    <th className="p-2 text-left">Author</th>
                    <th className="p-2 text-left">Genre</th>
                    <th className="p-2 text-left">Year of Publishing</th>
                    <th className="p-2 text-left">ISBN</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr
                      key={book._id}
                      className="border-b dark:border-gray-700"
                    >
                      <td className="p-2">{book.sno}</td>
                      <td className="p-2">{book.booktitle}</td>
                      <td className="p-2">{book.author}</td>
                      <td className="p-2">{book.genre}</td>
                      <td className="p-2">{book.yop}</td>
                      <td className="p-2">{book.isbn}</td>
                      <td className="p-2">
                        <button
                          onClick={() => {
                            setEditingId(book._id);
                            setEditedBook({
                              booktitle: book.booktitle,
                              author: book.author,
                              genre: book.genre,
                              yop: book.yop,
                              isbn: book.isbn,
                            });
                          }}
                          className="bg-blue-500 text-white p-2 rounded mr-2"
                        >
                          📝 Edit
                        </button>
                        <button
                          onClick={() => deleteBook(book._id)}
                          className="bg-red-500 text-white p-2 rounded"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit book section */}
          {editingId && (
            <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mt-4">
              <h2 className="text-md font-bold mb-2 text-gray-600 dark:text-gray-200">
                Edit book
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                {Object.keys(editedBook).map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={editedBook[field as keyof typeof editedBook]}
                    onChange={(e) =>
                      handleEditChange(e, field as keyof typeof editedBook)
                    }
                    className="w-full p-2 border rounded dark:bg-slate-700 dark:text-gray-300"
                  />
                ))}
              </div>
              <button
                onClick={saveEdit}
                className="bg-blue-500 text-white p-2 rounded"
              >
                💾 Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Books;
