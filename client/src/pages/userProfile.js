import React, { useState } from 'react';
import { Container, Row, Col, Card, Image, Button, Form } from 'react-bootstrap';


const UserProfile = () => {
  const initialProfileData = {
    code: 'HE123456',
    fullName: 'NGUYEN VAN AA',
    email: 'johndoe@example.com',
    phoneNumber: '0912345678',
    image: 'https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg', 
  };

  const [profile, setProfile] = useState(initialProfileData);
  const [editable, setEditable] = useState(false); // Trạng thái chỉnh sửa
  const [newProfile, setNewProfile] = useState(profile);

  // Xử lý thay đổi thông tin khi người dùng chỉnh sửa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Xử lý thay đổi ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setNewProfile((prevProfile) => ({
        ...prevProfile,
        image: imageURL,
      }));
    }
  };

  // Lưu thông tin chỉnh sửa
  const handleSave = () => {
    setProfile(newProfile);
    setEditable(false); // Sau khi lưu, chuyển sang chế độ không chỉnh sửa
  };

  return (
    <div style={{display: 'contents'}}>
    <Container className="profile-container my-5" >
      <Card className="p-4 shadow-lg rounded-lg">
        <Row className="align-items-center">
          <Col md={4} className="text-center" style={{ paddingRight: '0' }}>
            <Image
              src={newProfile.image}
              roundedCircle
              className="profile-image mb-3"
              style={{ width: '150px', height: '150px', border: '4px solid #3498db', marginBottom: '0' }} // Giảm margin bottom
            />
            {editable && (
              <Form.Group>
                <Form.Label>Change Profile Picture</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
              </Form.Group>
            )}
          </Col>
          <Col md={8}>
            <h4 className="mb-3 text-primary">{profile.fullName}</h4>
            <Form>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}><strong>Code:</strong></Form.Label>
                <Col sm={9}>
                  <Form.Control readOnly defaultValue={profile.code} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}><strong>Email:</strong></Form.Label>
                <Col sm={9}>
                  <Form.Control 
                    readOnly={true}
                    name="email"
                    value={profile.email}
                    // onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}><strong>Phone:</strong></Form.Label>
                <Col sm={9}>
                  <Form.Control 
                    readOnly={!editable}
                    name="phoneNumber"
                    value={newProfile.phoneNumber}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
            </Form>
            {editable ? (
              <Button 
                variant="success" 
                className="mt-3 w-100 shadow-sm"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            ) : (
              <Button 
                variant="primary" 
                className="mt-3 w-100 shadow-sm"
                onClick={() => setEditable(true)}
              >
                Edit Profile
              </Button>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
    </div>
  );
};

export default UserProfile;
