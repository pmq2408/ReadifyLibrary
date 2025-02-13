import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { BsPencilSquare, BsTrash, BsPlus, BsSearch, BsFunnel } from 'react-icons/bs';

const ListBook = () => {
  // Sample book data
  const [books, setBooks] = useState([
    { 
      id: 1, 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      year: 1925,
      status: 'Available',
      isbn: '978-0743273565',
      quantity: 5
    },
    { 
      id: 2, 
      title: 'To Kill a Mockingbird', 
      author: 'Harper Lee',
      genre: 'Classic',
      year: 1960,
      status: 'Available',
      isbn: '978-0446310789',
      quantity: 3
    },
    { 
      id: 3, 
      title: 'Clean Code', 
      author: 'Robert C. Martin',
      genre: 'Technology',
      year: 2008,
      status: 'Out of Stock',
      isbn: '978-0132350884',
      quantity: 0
    }
  ]);

  // States for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // States for filters
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    status: '',
    yearFrom: '',
    yearTo: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // New book template
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
    status: 'Available',
    isbn: '',
    quantity: 0
  });

  // Available genres and statuses for filters
  const genres = ['Fiction', 'Classic', 'Technology', 'Science', 'History', 'Biography'];
  const statuses = ['Available', 'Out of Stock', 'Reserved'];

  // Filter books based on criteria
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         book.author.toLowerCase().includes(filters.search.toLowerCase()) ||
                         book.isbn.includes(filters.search);
    
    const matchesGenre = !filters.genre || book.genre === filters.genre;
    const matchesStatus = !filters.status || book.status === filters.status;
    const matchesYear = (!filters.yearFrom || book.year >= parseInt(filters.yearFrom)) &&
                       (!filters.yearTo || book.year <= parseInt(filters.yearTo));

    return matchesSearch && matchesGenre && matchesStatus && matchesYear;
  });

  // CRUD Operations
  const handleAdd = () => {
    setBooks([...books, { ...newBook, id: books.length + 1 }]);
    setNewBook({
      title: '',
      author: '',
      genre: '',
      year: '',
      status: 'Available',
      isbn: '',
      quantity: 0
    });
    setShowAddModal(false);
  };

  const handleEdit = () => {
    setBooks(books.map(book => 
      book.id === selectedBook.id ? selectedBook : book
    ));
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(book => book.id !== id));
    }
  };

  return (
    <Container fluid className="py-4">
      <Card>
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">Book Catalog</h4>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  className="d-flex align-items-center gap-2"
                >
                  <BsFunnel />
                  Filters
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => setShowAddModal(true)}
                  className="d-flex align-items-center gap-2"
                >
                  <BsPlus />
                  Add Book
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {/* Search and Filters */}
          <div className="mb-4">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search by title, author, or ISBN..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
              <InputGroup.Text>
                <BsSearch />
              </InputGroup.Text>
            </InputGroup>

            {showFilters && (
              <Row className="g-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Genre</Form.Label>
                    <Form.Select
                      value={filters.genre}
                      onChange={(e) => setFilters({...filters, genre: e.target.value})}
                    >
                      <option value="">All Genres</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="">All Statuses</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Year From</Form.Label>
                    <Form.Control
                      type="number"
                      value={filters.yearFrom}
                      onChange={(e) => setFilters({...filters, yearFrom: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Year To</Form.Label>
                    <Form.Control
                      type="number"
                      value={filters.yearTo}
                      onChange={(e) => setFilters({...filters, yearTo: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </div>

          {/* Books Table */}
          <Table responsive bordered hover>
            <thead className="bg-light">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Status</th>
                <th>ISBN</th>
                <th>Quantity</th>
                <th className="text-center" style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.year}</td>
                  <td>
                    <span className={`badge bg-${book.status === 'Available' ? 'success' : 
                      book.status === 'Out of Stock' ? 'danger' : 'warning'}`}>
                      {book.status}
                    </span>
                  </td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setSelectedBook(book);
                          setShowEditModal(true);
                        }}
                      >
                        <BsPencilSquare />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(book.id)}
                      >
                        <BsTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Select
                value={newBook.genre}
                onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
              >
                <option value="">Select Genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    value={newBook.year}
                    onChange={(e) => setNewBook({...newBook, year: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={newBook.quantity}
                    onChange={(e) => setNewBook({...newBook, quantity: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                value={newBook.isbn}
                onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newBook.status}
                onChange={(e) => setNewBook({...newBook, status: e.target.value})}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Book
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={selectedBook?.title || ''}
                onChange={(e) => setSelectedBook({...selectedBook, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={selectedBook?.author || ''}
                onChange={(e) => setSelectedBook({...selectedBook, author: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Select
                value={selectedBook?.genre || ''}
                onChange={(e) => setSelectedBook({...selectedBook, genre: e.target.value})}
              >
                <option value="">Select Genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedBook?.year || ''}
                    onChange={(e) => setSelectedBook({...selectedBook, year: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedBook?.quantity || ''}
                    onChange={(e) => setSelectedBook({...selectedBook, quantity: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                value={selectedBook?.isbn || ''}
                onChange={(e) => setSelectedBook({...selectedBook, isbn: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={selectedBook?.status || ''}
                onChange={(e) => setSelectedBook({...selectedBook, status: e.target.value})}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListBook;