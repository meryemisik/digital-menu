'use client'
import { useState, useEffect } from 'react'
import { Button, Card, Image, Container, Row, Col, Modal, Navbar, Form, FloatingLabel } from 'react-bootstrap'
import { db, collection, getDocs, addDoc, getFirestore } from '../firebase-config'
import Link from 'next/link';

import 'bootstrap/dist/css/bootstrap.min.css'
import '../asset/scss/companies.scss'
export default function Home() {

  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  const addCompany = async () => {
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'companies'), {
       companyEmail: email,
       companyPassword: password,
       companyName: companyName
      });
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const companyCol = collection(db, "companies");
      const querySnapshot = await getDocs(companyCol);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setData(data);
    };

    fetchData();
  }, []);
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Navbar.Brand href="#home">
          LOGO
        </Navbar.Brand>
      </Navbar>
      <Container className='company'>
        <div className='company-header'>
          <div className='company-title'>Company List</div>
          <Button variant="light" onClick={() => setShowModal(true)}>Add Company</Button>
        </div>
        <div className='company-page'>
          {data.map((item, index) => (
            <Link href={`screens/category/${item.companyId}`}>
              <Card>
                <Card.Img variant="top" src={item.companyLogo} />
                <Card.Title className='company-page-title'> {item.companyName} </Card.Title>
                <Card.Text> <em>{item.companyContent}</em>
                </Card.Text>
              </Card>
            </Link>
          ))}

        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Company</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <FloatingLabel label="Company Name" className="mb-1">
              <Form.Control type="text" placeholder="Company Name" onChange={(e) => setCompanyName(e.target.value)}/>
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingInput"
              label="Email"
              className="mb-1"
            >
              <Form.Control type="email" placeholder="Email"  onChange={(e) => setEmail(e.target.value)}/>
            </FloatingLabel>
            <FloatingLabel label="Password" className="mb-1">
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={addCompany}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </Container>

    </>
  )
}

