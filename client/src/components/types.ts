export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  yearOfPublishing: number;
  isbn: string;
}

export type NewBook = Omit<Book, "_id">;
