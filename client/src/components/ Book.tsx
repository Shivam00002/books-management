import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  yearOfPublishing: Date;
  isbn: string;
}

interface BookProps {
  book: Book;
  index: number;
  onUpdateBook: (id: string, updatedBook: Omit<Book, "_id">) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
}

const Book: React.FC<BookProps> = ({
  book,
  index,
  onUpdateBook,
  onDeleteBook,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Book>(book);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Book
  ) => {
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleEditDateChange = (date: Date) => {
    setEditForm((prev) => ({ ...prev, yearOfPublishing: date }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdateBook(book._id, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteBook(book._id);
    } catch (error) {
      console.error("Error deleting book:", error);
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isEditing) {
    return (
      <tr className="border-b dark:border-gray-700">
        <td className="p-2">{index + 1}</td>
        <td className="p-2">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => handleEditInputChange(e, "title")}
            className="w-full p-1 border rounded dark:bg-slate-700 dark:text-gray-300"
          />
        </td>
        <td className="p-2 hidden sm:table-cell">
          <input
            type="text"
            value={editForm.author}
            onChange={(e) => handleEditInputChange(e, "author")}
            className="w-full p-1 border rounded dark:bg-slate-700 dark:text-gray-300"
          />
        </td>
        <td className="p-2 hidden md:table-cell">
          <input
            type="text"
            value={editForm.genre}
            onChange={(e) => handleEditInputChange(e, "genre")}
            className="w-full p-1 border rounded dark:bg-slate-700 dark:text-gray-300"
          />
        </td>
        <td className="p-2 hidden lg:table-cell">
          <DatePicker
            selected={editForm.yearOfPublishing}
            onChange={handleEditDateChange}
            dateFormat="yyyy-MM-dd"
            className="w-full p-1 border rounded dark:bg-slate-700 dark:text-gray-300"
          />
        </td>
        <td className="p-2 hidden xl:table-cell">
          <input
            type="text"
            value={editForm.isbn}
            onChange={(e) => handleEditInputChange(e, "isbn")}
            className="w-full p-1 border rounded dark:bg-slate-700 dark:text-gray-300"
          />
        </td>
        <td className="p-2">
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className={`text-green-500 hover:text-green-600 ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUpdating ? (
                <svg
                  className="animate-spin h-5 w-5 text-green-500"
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
              ) : (
                "💾"
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-600"
            >
              ❌
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b dark:border-gray-700">
      <td className="p-2">{index + 1}</td>
      <td className="p-2">{book.title}</td>
      <td className="p-2 hidden sm:table-cell">{book.author}</td>
      <td className="p-2 hidden md:table-cell">{book.genre}</td>
      <td className="p-2 hidden lg:table-cell">
        {formatDate(book.yearOfPublishing)}
      </td>
      <td className="p-2 hidden xl:table-cell">{book.isbn}</td>
      <td className="p-2">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDeleting ? (
              <svg
                className="animate-spin h-5 w-5 text-red-500"
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
            ) : (
              "🗑️"
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Book;
