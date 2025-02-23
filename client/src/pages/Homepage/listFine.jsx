import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { BsPencilSquare, BsTrash, BsPersonPlus } from 'react-icons/bs';

const ListFine = () => {
  const [fines, setfines] = useState([
    { id: 1, violataion: 'InActive Access violataion', description: 'Defines access permissions for regular InActives', status: 'Active',fine: '10$' },
    { id: 2, violataion: 'Content Moderation violataion', description: 'fines for content moderation and posting', status: 'Active' ,fine: '10$' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    violataion: '',
    description: '',
    status: '',
    fine: '' 
  });

  const handleAdd = () => {
    setfines([...fines, { ...newAccount, id: fines.length + 1 }]);
    setNewAccount({ violataion: '', description: '', status: '',fine:'' });
    setShowAddModal(false);
  };

  const handleEdit = () => {
    setfines(fines.map(acc => 
      acc.id === selectedAccount.id ? selectedAccount : acc
    ));
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setfines(fines.filter(acc => acc.id !== id));
    }
  };

  return (
    <Container fluid className="py-4">
      <Card>
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">Fine Management</h4>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)}
                className="d-flex align-items-center gap-2"
              >
                <BsPersonPlus />
                Add violataion
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Table responsive bordered hover>
            <thead className="bg-light">
              <tr>
                <th>STT</th>
                <th>violataion</th>
                <th>Description</th>
                <th>Status</th>
                <th>Fine</th>
                <th className="text-center" style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fines.map((account) => (
                <tr key={account.id}>
                  <td>{account.id}</td>
                  <td>{account.violataion}</td>
                  <td>{account.description}</td> 
                  <td>{account.status}</td>
                  <td>{account.fine}</td>

                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowEditModal(true);
                        }}
                      >
                        <BsPencilSquare />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(account.id)}
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
          <Modal.Title>Add New Fine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>violataion</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter violataion"
                value={newAccount.violataion}
                onChange={(e) => setNewAccount({...newAccount, violataion: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>description</Form.Label>
              <Form.Control
                type="description"
                placeholder="Enter description"
                value={newAccount.description}
                onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>status</Form.Label>
              <Form.Select
                value={newAccount.status}
                onChange={(e) => setNewAccount({...newAccount, status: e.target.value})}
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
                
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>fine</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter fine"
                value={newAccount.fine}
                onChange={(e) => setNewAccount({...newAccount, fine: e.target.value})}
              />
              
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add violataion
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>violataion</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter violataion"
                value={selectedAccount?.violataion || ''}
                onChange={(e) => setSelectedAccount({...selectedAccount, violataion: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>description</Form.Label>
              <Form.Control
                type="description"
                placeholder="Enter description"
                value={selectedAccount?.description || ''}
                onChange={(e) => setSelectedAccount({...selectedAccount, description: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>status</Form.Label>
              <Form.Select
                value={selectedAccount?.status || ''}
                onChange={(e) => setSelectedAccount({...selectedAccount, status: e.target.value})}
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
                
              </Form.Select>
            </Form.Group>
            

            <Form.Group className="mb-3">
              <Form.Label>fine</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter fine"
                value={selectedAccount?.fine || ''}
                onChange={(e) => setSelectedAccount({...selectedAccount, fine: e.target.value})}
              />
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

export default ListFine;