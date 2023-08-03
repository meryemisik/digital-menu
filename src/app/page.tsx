'use client'
import { useState, useEffect, ChangeEvent } from 'react'
import { Button, Card, Container, Row, Col, Modal, Navbar, Form, FloatingLabel } from 'react-bootstrap'
import Image from "next/image";
import { db, collection, getDocs, addDoc, getFirestore } from '../firebase-config'
import Link from 'next/link';
import Loading from './components/loading'
import plus from '../asset/images/plus.svg'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../asset/scss/companies.scss'
import Swal from 'sweetalert2/dist/sweetalert2.js'

import 'sweetalert2/src/sweetalert2.scss'

export default function Home() {

  const [data, setData] = useState<any[]>([]);
  const [showAddCompanyModal, setAddCompanyShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64Data, setBase64Data] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Data(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  const addCompany = async () => {
    var newCompanyId = `${Math.floor(
      Math.random() * Math.pow(10, 20),
    )}-${new Date().getTime()}`;
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'companies'), {
        companyEmail: email,
        companyPassword: password,
        companyName: companyName,
        companyId: newCompanyId,
        companyContent: content,
        companyLogo: base64Data,
        createdDate: new Date(),
      }).then((res) => {
        setAddCompanyShowModal(false)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'İşlem başarılı!',
          showConfirmButton: false,
          timer: 1500
        })
        
      });
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hay aksi!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      const companyCol = collection(db, "companies");
      const querySnapshot = await getDocs(companyCol);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setData(data);
      setIsLoading(false);
    };

    fetchData();
  }, [addCompany]);
  return (
    <>

      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <div>

            <Navbar className="bg-body-tertiary">
              <Navbar.Brand href="#home">
                LOGO
              </Navbar.Brand>
            </Navbar>
            <Container className='company'>
              <div className='company-header'>
                <div className='company-title'>Company List</div>

              </div>
              <div className='company-page'>

                <Row xs={1} sm={2} md={3} lg={4}>
                  <Col>
                    <Button className='company-page-add-company-btn' variant="success" onClick={() => setAddCompanyShowModal(true)}><h4 > <Image className='company-page-plus' src={plus} alt="plus" /> Add Company</h4></Button>
                  </Col>

                  {data.map((item) => (
                    <Col key={item.companyId}>
                      <Link className='company-page-link' href={`screens/category/${item.companyId}`}>
                        <Card>
                          <Card.Img variant="top" src={item.companyLogo} />
                          <Card.Body>
                            <Card.Title>{item.companyName}</Card.Title>
                            <Card.Text>
                              <em>
                                {item.companyContent.length > 150
                                  ? item.companyContent.substring(0, 150) + '...'
                                  : item.companyContent
                                }
                              </em>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>



              <Modal show={showAddCompanyModal} onHide={() => setAddCompanyShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Company</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <FloatingLabel label="Company Name" className="mb-1">
                    <Form.Control type="text" placeholder="Company Name" onChange={(e) => setCompanyName(e.target.value)} />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="floatingInput"
                    label="Email"
                    className="mb-1"
                  >
                    <Form.Control type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                  </FloatingLabel>
                  <FloatingLabel label="Password" className="mb-1">
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                  </FloatingLabel>
                  <FloatingLabel label="Content" className="mb-1">
                    <Form.Control type="text" placeholder="Content" onChange={(e) => setContent(e.target.value)} />
                  </FloatingLabel>

                  <FloatingLabel label="Logo" className="mb-1">
                    <Form.Control type="file" onChange={handleFileChange} />
                  </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="success" onClick={addCompany}>Add Company</Button>
                </Modal.Footer>
              </Modal>
            </Container>
          </div>
        )}
      </div>
    </>
  )
}

