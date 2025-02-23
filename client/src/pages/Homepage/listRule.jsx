import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { BsPencilSquare, BsTrash, BsPersonPlus } from 'react-icons/bs';

const ListRule = () => {
  const [rules, setrules] = useState([
    { id: 1, rule: 'InActive Access Rule', description: 'Defines access permissions for regular InActives', status: 'Active' },
    { id: 2, rule: 'Content Moderation Rule', description: 'Rules for content moderation and posting', status: 'Active' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    rule: '',
    description: '',
    status: ''
  });

  const handleAdd = () => {
    setrules([...rules, { ...newAccount, id: rules.length + 1 }]);
    setNewAccount({ rule: '', description: '', status: '' });
    setShowAddModal(false);
  };

  const handleEdit = () => {
    setrules(rules.map(acc => 
      acc.id === selectedAccount.id ? selectedAccount : acc
    ));
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setrules(rules.filter(acc => acc.id !== id));
    }
  };

  return (
    <Container fluid className="py-4">
      <Card>
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">Rule Management</h4>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)}
                className="d-flex align-items-center gap-2"
              >
                <BsPersonPlus />
                Add Rule
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Table responsive bordered hover>
            <thead className="bg-light">
              <tr>
                <th>#</th>
                <th>Rule</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-center" style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((account) => (
                <tr key={account.id}>
                  <td>{account.id}</td>
                  <td>{account.rule}</td>
                  <td>{account.description}</td>
                  <td>{account.status}</td>
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
          <Modal.Title>Add New Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>rule</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter rule"
                value={newAccount.rule}
                onChange={(e) => setNewAccount({...newAccount, rule: e.target.value})}
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Rule
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
              <Form.Label>rule</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter rule"
                value={selectedAccount?.rule || ''}
                onChange={(e) => setSelectedAccount({...selectedAccount, rule: e.target.value})}
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

export default ListRule;