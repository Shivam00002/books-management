import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { backend_url } from "../libs/url";
import { useRouter } from "next/router";
import BookForm from "@/components/BookForm";
import BookList from "@/components/BookList";

interface BookData {
  _id: string;
  title: string;
  author: string;
  genre: string;
  yearOfPublishing: number;
  isbn: string;
}

const API_URL = backend_url;

const Books: React.FC = () => {
  const [books, setBooks] = useState<BookData[]>([]);
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

      const response = await axios.get<BookData[]>(`${API_URL}/books`, {
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

  const addBook = async (newBook: Omit<BookData, "_id">) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.post<BookData>(`${API_URL}/books`, newBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
      setError("Failed to add book. Please try again.");
    }
  };

  const updateBook = async (id: string, updatedBook: Omit<BookData, "_id">) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.put<BookData>(`${API_URL}/books/${id}`, updatedBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      setError("Failed to delete book. Please try again.");
    }
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

      <BookForm onAddBook={addBook} />

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <BookList
        books={books}
        isLoading={isLoading}
        onUpdateBook={updateBook}
        onDeleteBook={deleteBook}
      />
    </div>
  );
};

export default Books;
