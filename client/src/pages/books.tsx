import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { backend_url } from "../libs/url";
import { useRouter } from "next/router";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newBookForm, setNewBookForm] = useState<Omit<Book, "_id">>({
    title: "",
    author: "",
    genre: "",
    yearOfPublishing: new Date().getFullYear(),
    isbn: "",
  });
  const [editForm, setEditForm] = useState<Book | null>(null);
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

      const response = await axios.post<Book>(`${API_URL}/books`, newBookForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prevBooks) => [...prevBooks, response.data]);
      resetNewBookForm();
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
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book._id === id ? updatedBook.data : book))
      );
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      console.error("Error updating book:", error);
      setError("Failed to update book. Please try again.");
    }
  };

  const deleteBook = async (id: string) => {
    setError(null);
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(`${API_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
      setError("Failed to delete book. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleNewBookInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Omit<Book, "_id">
  ) => {
    const value =
      field === "yearOfPublishing" ? Number(e.target.value) : e.target.value;
    setNewBookForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Book
  ) => {
    if (editForm) {
      const value =
        field === "yearOfPublishing" ? Number(e.target.value) : e.target.value;
      setEditForm((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const isFormValid = (book: Omit<Book, "_id">) =>
    Object.values(book).every((value) =>
      typeof value === "string"
        ? value.trim() !== ""
        : typeof value === "number" && value > 0
    );

  const resetNewBookForm = () => {
    setNewBookForm({
      title: "",
      author: "",
      genre: "",
      yearOfPublishing: new Date().getFullYear(),
      isbn: "",
    });
  };

  return (
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

      <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mb-4">
        <h2 className="text-md font-bold mb-2 text-gray-600 dark:text-gray-200">
          Add new book
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {Object.keys(newBookForm).map((field) => (
            <input
              key={field}
              type={field === "yearOfPublishing" ? "number" : "text"}
              placeholder={
                field.charAt(0).toUpperCase() +
                field.slice(1).replace(/([A-Z])/g, " $1")
              }
              value={newBookForm[field as keyof typeof newBookForm]}
              onChange={(e) =>
                handleNewBookInputChange(e, field as keyof typeof newBookForm)
              }
              className="w-full p-2 border rounded dark:bg-slate-700 dark:text-gray-300"
            />
          ))}
        </div>
        <button
          onClick={addBook}
          disabled={!isFormValid(newBookForm)}
          className={`bg-blue-500 text-white p-2 rounded ${
            !isFormValid(newBookForm) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          ➕ Add Book
        </button>
      </div>

   

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-800">
                <th className="p-2 text-left">S no.</th>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left hidden sm:table-cell">Author</th>
                <th className="p-2 text-left hidden md:table-cell">Genre</th>
                <th className="p-2 text-left hidden lg:table-cell">Year</th>
                <th className="p-2 text-left hidden xl:table-cell">ISBN</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book._id} className="border-b dark:border-gray-700">
                  <td className="p-2">{index + 1}</td>
                  {editingId === book._id ? (
                    <>
                      <td className="p-2">
                        <input
                          type="text"
                          value={editForm?.title || ""}
                          onChange={(e) => handleEditInputChange(e, "title")}
                          className="w-full p-1 border rounded dark:bg-slate-700 dark:text-gray-300"
                        />
                      </td>
                      <td className="p-2 hidden sm:table-cell">
                        <input
                          type="text"
                          value={editForm?.author || ""}
                          onChange={(e) => handleEditInputChange(e, "author")}
                          className="w-full p-1 border rounded dark:bg-slate-700 dark:text-gray-300"
                        />
                      </td>
                      <td className="p-2 hidden md:table-cell">
                        <input
                          type="text"
                          value={editForm?.genre || ""}
                          onChange={(e) => handleEditInputChange(e, "genre")}
                          className="w-full p-1 border rounded dark:bg-slate-700 dark:text-gray-300"
                        />
                      </td>
                      <td className="p-2 hidden lg:table-cell">
                        <input
                          type="number"
                          value={editForm?.yearOfPublishing || ""}
                          onChange={(e) => handleEditInputChange(e, "yearOfPublishing")}
                          className="w-full p-1 border rounded dark:bg-slate-700 dark:text-gray-300"
                        />
                      </td>
                      <td className="p-2 hidden xl:table-cell">
                        <input
                          type="text"
                          value={editForm?.isbn || ""}
                          onChange={(e) => handleEditInputChange(e, "isbn")}
                          className="w-full p-1 border rounded dark:bg-slate-700 dark:text-gray-300"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{book.title}</td>
                      <td className="p-2 hidden sm:table-cell">{book.author}</td>
                      <td className="p-2 hidden md:table-cell">{book.genre}</td>
                      <td className="p-2 hidden lg:table-cell">{book.yearOfPublishing}</td>
                      <td className="p-2 hidden xl:table-cell">{book.isbn}</td>
                    </>
                  )}
                  <td className="p-2">
                    <div className="flex justify-end space-x-2">
                      {editingId === book._id ? (
                        <>
                          <button
                            onClick={() => updateBook(book._id)}
                          
                            className={`text-green-500 hover:text-green-600 ${
                              !isFormValid(editForm!) && "opacity-50 cursor-not-allowed"
                            }`}
                          >
                            💾
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm(null);
                            }}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            ❌
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(book._id);
                            setEditForm(book);
                          }}
                          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                        >
                          {editingId === book._id ? (
                            <img
                              src="https://cdn-icons-gif.flaticon.com/17098/17098052.gif"
                              alt="Editing"
                              className="inline-block h-5 w-5"
                            />
                          ) : (
                            "✏️"
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => deleteBook(book._id)}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
                      >
                        {deletingId === book._id ? (
                          <img
                            src="https://cdn-icons-gif.flaticon.com/10624/10624157.gif"
                            alt="Deleting"
                            className="inline-block h-5 w-5"
                          />
                        ) : (
                          "🗑️"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Books;