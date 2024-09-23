import React, { useState } from "react";
import { Book } from "./types";

interface BookFormProps {
  onAddBook: (newBook: Omit<Book, "_id">) => Promise<void>;
}

const BookForm: React.FC<BookFormProps> = ({ onAddBook }) => {
  const [newBook, setNewBook] = useState<Omit<Book, "_id">>({
    title: "",
    author: "",
    genre: "",
    yearOfPublishing: new Date().getFullYear(),
    isbn: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Omit<Book, "_id">
  ) => {
    setNewBook((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value);
    if (!isNaN(year)) {
      setNewBook((prev) => ({ ...prev, yearOfPublishing: year }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onAddBook(newBook);
    setIsSubmitting(false);
    setNewBook({
      title: "",
      author: "",
      genre: "",
      yearOfPublishing: new Date().getFullYear(),
      isbn: "",
    });
  };

  const isFormValid = () =>
    Object.values(newBook).every((value) => value !== "");

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mb-4"
    >
      <h2 className="text-md font-bold mb-2 text-gray-600 dark:text-gray-200">
        Add new book
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => handleInputChange(e, "title")}
          className="w-full p-2 border rounded dark:bg-slate-700 dark:text-gray-300"
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => handleInputChange(e, "author")}
          className="w-full p-2 border rounded dark:bg-slate-700 dark:text-gray-300"
        />
        <input
          type="text"
          placeholder="Genre"
          value={newBook.genre}
          onChange={(e) => handleInputChange(e, "genre")}
          className="w-full p-2 border rounded dark:bg-slate-700 dark:text-gray-300"
        />
        <input
          type="number"
          placeholder="Year of Publishing"
          value={newBook.yearOfPublishing}
          onChange={handleYearChange}
          className="w-full p-2 border rounded dark:bg-slate-700 dark:text-gray-300"
          min="1000"
          max={new Date().getFullYear()}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={newBook.isbn}
          onChange={(e) => handleInputChange(e, "isbn")}
          className="w-full p-2 border rounded dark:bg-slate-700 dark:text-gray-300"
        />
      </div>
      <button
        type="submit"
        disabled={!isFormValid() || isSubmitting}
        className={`bg-[#35a7f9] text-white p-2 rounded ${
          !isFormValid() || isSubmitting
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#1d8ede]"
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding...
          </span>
        ) : (
          "➕ Add Book"
        )}
      </button>
    </form>
  );
};

export default BookForm;
