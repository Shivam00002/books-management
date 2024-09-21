const Book = require('../models/Book');


exports.createBook = async (req, res) => {
  try {
    const newBook = new Book({
      ...req.body,
      user: req.user.id,
    });

    const book = await newBook.save();
    res.json({ msg: 'Book created successfully', book });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ msg: 'Book not found' });

    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ msg: 'Book updated successfully', book });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.deleteBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ msg: 'Book not found' });

    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Book deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

