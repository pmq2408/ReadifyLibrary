import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { BsPencilSquare, BsTrash, BsPersonPlus } from 'react-icons/bs';

const ListAccount = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, username: 'admin1', email: 'admin1@example.com', role: 'Administrator' },
    { id: 2, username: 'user1', email: 'user1@example.com', role: 'User' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    username: '',
    email: '',
    role: ''
  });

  const handleAdd = () => {
    setAccounts([...accounts, { ...newAccount, id: accounts.length + 1 }]);
    setNewAccount({ username: '', email: '', role: '' });
    setShowAddModal(false);
  };

  const handleEdit = () => {
    setAccounts(accounts.map(acc => 
      acc.id === selectedAccount.id ? selectedAccount : acc
    ));
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(acc => acc.id !== id));
    }
  };

  return (
    <Container fluid className="py-4">
      <Card>
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col>
            <h2 className="text-3xl font-bold mb-5 text-indigo-700">Quản lý Tài Khoản</h2>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)}
                className="d-flex align-items-center gap-2"
              >
                <BsPersonPlus />
                Add Account
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Table responsive bordered hover>
            <thead className="bg-light">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center" style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.username}</td>
                  <td>{account.email}</td>
                  <td>{account.role}</td>
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
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={newAccount.username}
                onChange={(e) => setNewAccount({...newAccount, username: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newAccount.email}
                onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newAccount.role}
                onChange={(e) => setNewAccount({...newAccount, role: e.target.value})}
              >
                <option value="">Select role</option>
                <option value="Administrator">Administrator</option>
                <option value="User">User</option>
                <option value="Manager">Manager</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Account
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
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={selectedAccount?.username || ''}
                onChange={(e) => setSelectedAccount({...selectedAccount, username: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={selectedAccount?.email || ''}
                onChange={(e) => setSelectedAccount({...selectedAccount, email: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={selectedAccount?.role || ''}
                onChange={(e) => setSelectedAccount({...selectedAccount, role: e.target.value})}
              >
                <option value="">Select role</option>
                <option value="Administrator">Administrator</option>
                <option value="User">User</option>
                <option value="Manager">Manager</option>
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

export default ListAccount;