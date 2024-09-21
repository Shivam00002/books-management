import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { backend_url } from "../libs/url";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/ ProtectedRoute";

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  yearOfPublishing: number;
  isbn: string;
}

const API_URL = backend_url;

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState<Omit<Book, "_id">>({
    title: "",
    author: "",
    genre: "",
    yearOfPublishing: 0,
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
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get<Book[]>(`${API_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(response.data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to fetch books. Please try again.");
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addBook = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post<Book>(`${API_URL}/books`, bookForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prevBooks) => [...prevBooks, response.data]);
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
      setError("Failed to add book. Please try again.");
    }
  };

  const updateBook = async (id: string) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const updatedBook = await axios.put<Book>(
        `${API_URL}/books/${id}`,
        bookForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book._id === id ? updatedBook.data : book))
      );
      setEditingId(null);
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      setError("Failed to update book. Please try again.");
    }
  };

  const deleteBook = async (id: string) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(`${API_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      setError("Failed to delete book. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Omit<Book, "_id">
  ) => {
    const value =
      field === "yearOfPublishing" ? Number(e.target.value) : e.target.value;
    setBookForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(bookForm).every((value) =>
    typeof value === "string"
      ? value.trim() !== ""
      : typeof value === "number" && value > 0
  );

  const resetForm = () => {
    setBookForm({
      title: "",
      author: "",
      genre: "",
      yearOfPublishing: 0,
      isbn: "",
    });
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 bg-white dark:bg-slate-950 transition-colors duration-500">
        <Head>
          <title>Book Management - Your Library</title>
          <meta
            name="description"
            content="Manage your book collection with our easy-to-use interface."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Book Management
        </h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mb-4">
          <h2 className="text-md font-bold mb-2 text-gray-600 dark:text-gray-200">
            {editingId ? "Edit book" : "Add new book"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {Object.keys(bookForm).map((field) => (
              <input
                key={field}
                type={field === "yearOfPublishing" ? "number" : "text"}
                placeholder={
                  field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/([A-Z])/g, " $1")
                }
                value={bookForm[field as keyof typeof bookForm]}
                onChange={(e) =>
                  handleInputChange(e, field as keyof typeof bookForm)
                }
                className="w-full p-2 border rounded dark:bg-slate-700 dark:text-gray-300"
              />
            ))}
          </div>
          <button
            onClick={() => (editingId ? updateBook(editingId) : addBook())}
            disabled={!isFormValid}
            className={`bg-blue-500 text-white p-2 rounded ${
              !isFormValid
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {editingId ? "💾 Save Changes" : "➕ Add Book"}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-800">
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left hidden sm:table-cell">Author</th>
                  <th className="p-2 text-left hidden md:table-cell">Genre</th>
                  <th className="p-2 text-left hidden lg:table-cell">Year</th>
                  <th className="p-2 text-left hidden xl:table-cell">ISBN</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="border-b dark:border-gray-700">
                    <td className="p-2">{book.title}</td>
                    <td className="p-2 hidden sm:table-cell">{book.author}</td>
                    <td className="p-2 hidden md:table-cell">{book.genre}</td>
                    <td className="p-2 hidden lg:table-cell">
                      {book.yearOfPublishing}
                    </td>
                    <td className="p-2 hidden xl:table-cell">{book.isbn}</td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          setEditingId(book._id);
                          setBookForm({
                            title: book.title,
                            author: book.author,
                            genre: book.genre,
                            yearOfPublishing: book.yearOfPublishing,
                            isbn: book.isbn,
                          });
                        }}
                        className="bg-blue-500 text-white p-2 rounded mr-2 mb-2 sm:mb-0 hover:bg-blue-600"
                        aria-label="Edit"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => deleteBook(book._id)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        aria-label="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Books;
