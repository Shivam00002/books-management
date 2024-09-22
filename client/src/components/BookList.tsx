import React from "react";
import BookComponent from "./ Book";

interface BookData {
  _id: string;
  title: string;
  author: string;
  genre: string;
  yearOfPublishing: number;
  isbn: string;
}

interface BookListProps {
  books: BookData[];
  isLoading: boolean;
  onUpdateBook: (
    id: string,
    updatedBook: Omit<BookData, "_id">
  ) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
}

const BookList: React.FC<BookListProps> = ({
  books,
  isLoading,
  onUpdateBook,
  onDeleteBook,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
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
            <BookComponent
              key={book._id}
              book={book}
              index={index}
              onUpdateBook={onUpdateBook}
              onDeleteBook={onDeleteBook}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
