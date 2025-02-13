import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Card, Badge, InputGroup } from 'react-bootstrap';
import { BsPencilSquare, BsTrash, BsPlus, BsArrowReturnRight } from 'react-icons/bs';

const GenreManagement = () => {
  // Sample genre data with parent-child relationships
  const [genres, setGenres] = useState([
    { 
      id: 1, 
      name: 'Fiction',
      description: 'Narrative works created from imagination',
      subgenres: ['Science Fiction', 'Fantasy', 'Mystery'],
      status: 'Active',
      booksCount: 145
    },
    { 
      id: 2, 
      name: 'Non-Fiction',
      description: 'Works based on facts and real events',
      subgenres: ['Biography', 'History', 'Science'],
      status: 'Active',
      booksCount: 89
    },
    { 
      id: 3, 
      name: 'Poetry',
      description: 'Literary work in metrical form',
      subgenres: ['Lyric', 'Narrative', 'Dramatic'],
      status: 'Active',
      booksCount: 34
    }
  ]);

  // States for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [newGenre, setNewGenre] = useState({
    name: '',
    description: '',
    subgenres: [],
    status: 'Active',
    booksCount: 0
  });

  // State for new subgenre input
  const [newSubgenre, setNewSubgenre] = useState('');
  const [editNewSubgenre, setEditNewSubgenre] = useState('');

  // Handle adding new genre
  const handleAdd = () => {
    setGenres([...genres, { ...newGenre, id: genres.length + 1 }]);
    setNewGenre({
      name: '',
      description: '',
      subgenres: [],
      status: 'Active',
      booksCount: 0
    });
    setShowAddModal(false);
  };

  // Handle editing genre
  const handleEdit = () => {
    setGenres(genres.map(genre => 
      genre.id === selectedGenre.id ? selectedGenre : genre
    ));
    setShowEditModal(false);
  };

  // Handle deleting genre
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this genre? This will affect all books in this category.')) {
      setGenres(genres.filter(genre => genre.id !== id));
    }
  };

  // Handle adding subgenre
  const handleAddSubgenre = (isEdit = false) => {
    if (isEdit && editNewSubgenre) {
      setSelectedGenre({
        ...selectedGenre,
        subgenres: [...selectedGenre.subgenres, editNewSubgenre]
      });
      setEditNewSubgenre('');
    } else if (!isEdit && newSubgenre) {
      setNewGenre({
        ...newGenre,
        subgenres: [...newGenre.subgenres, newSubgenre]
      });
      setNewSubgenre('');
    }
  };

  // Handle removing subgenre
  const handleRemoveSubgenre = (subgenre, isEdit = false) => {
    if (isEdit) {
      setSelectedGenre({
        ...selectedGenre,
        subgenres: selectedGenre.subgenres.filter(sg => sg !== subgenre)
      });
    } else {
      setNewGenre({
        ...newGenre,
        subgenres: newGenre.subgenres.filter(sg => sg !== subgenre)
      });
    }
  };

  return (
    <Container fluid className="py-4">
      <Card>
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">Genre Management</h4>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary"
                onClick={() => setShowAddModal(true)}
                className="d-flex align-items-center gap-2"
              >
                <BsPlus />
                Add Genre
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <Table responsive bordered hover>
            <thead className="bg-light">
              <tr>
                <th>Genre Name</th>
                <th>Description</th>
                <th>Subgenres</th>
                <th>Status</th>
                <th>Books</th>
                <th className="text-center" style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre) => (
                <tr key={genre.id}>
                  <td>{genre.name}</td>
                  <td>{genre.description}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {genre.subgenres.map((subgenre, index) => (
                        <Badge key={index} bg="secondary" className="me-1">
                          {subgenre}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Badge bg={genre.status === 'Active' ? 'success' : 'danger'}>
                      {genre.status}
                    </Badge>
                  </td>
                  <td>{genre.booksCount}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setSelectedGenre(genre);
                          setShowEditModal(true);
                        }}
                      >
                        <BsPencilSquare />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(genre.id)}
                        disabled={genre.booksCount > 0}
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
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Genre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Genre Name</Form.Label>
              <Form.Control
                type="text"
                value={newGenre.name}
                onChange={(e) => setNewGenre({...newGenre, name: e.target.value})}
                placeholder="Enter genre name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newGenre.description}
                onChange={(e) => setNewGenre({...newGenre, description: e.target.value})}
                placeholder="Enter genre description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subgenres</Form.Label>
              <div className="mb-2">
                {newGenre.subgenres.map((subgenre, index) => (
                  <Badge 
                    key={index} 
                    bg="secondary" 
                    className="me-1 mb-1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveSubgenre(subgenre)}
                  >
                    {subgenre} ×
                  </Badge>
                ))}
              </div>
              <InputGroup>
                <Form.Control
                  value={newSubgenre}
                  onChange={(e) => setNewSubgenre(e.target.value)}
                  placeholder="Enter subgenre name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubgenre();
                    }
                  }}
                />
                <Button variant="outline-secondary" onClick={() => handleAddSubgenre()}>
                  Add
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newGenre.status}
                onChange={(e) => setNewGenre({...newGenre, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Genre
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Genre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Genre Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedGenre?.name || ''}
                onChange={(e) => setSelectedGenre({...selectedGenre, name: e.target.value})}
                placeholder="Enter genre name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedGenre?.description || ''}
                onChange={(e) => setSelectedGenre({...selectedGenre, description: e.target.value})}
                placeholder="Enter genre description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subgenres</Form.Label>
              <div className="mb-2">
                {selectedGenre?.subgenres.map((subgenre, index) => (
                  <Badge 
                    key={index} 
                    bg="secondary" 
                    className="me-1 mb-1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveSubgenre(subgenre, true)}
                  >
                    {subgenre} ×
                  </Badge>
                ))}
              </div>
              <InputGroup>
                <Form.Control
                  value={editNewSubgenre}
                  onChange={(e) => setEditNewSubgenre(e.target.value)}
                  placeholder="Enter subgenre name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubgenre(true);
                    }
                  }}
                />
                <Button variant="outline-secondary" onClick={() => handleAddSubgenre(true)}>
                  Add
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={selectedGenre?.status || ''}
                onChange={(e) => setSelectedGenre({...selectedGenre, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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

export default GenreManagement;