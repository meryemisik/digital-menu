'use client'
import { useState, useEffect, ChangeEvent } from 'react'
import { Button, Card, Image, Container, Row, Col, Modal, Navbar, Form, FloatingLabel } from 'react-bootstrap'
import { db, collection, getDocs, addDoc, getFirestore } from '../firebase-config'
import Link from 'next/link';
import Loading from './components/loading'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../asset/scss/companies.scss'
import Swal from 'sweetalert2/dist/sweetalert2.js'

import 'sweetalert2/src/sweetalert2.scss'

export default function Home() {

  const [data, setData] = useState([]);
  const [showAddCompanyModal, setAddCompanyShowModal] = useState(false);
  const [showAddCategoryModal, setAddCategoryShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // File türünü burada belirtiyoruz
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
  const addCategory = async () => {
    console.log('çalıştı')
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'categories'), {
        categoryId: 1,
        categoryImage: '',
        categoryName: categoryName,
        companyId: '14473200005262533000-1689428624433',
        itemList: [
          {
            itemId: 3,
            itemImage: '',
            itemName: 'test iitem name',
            itemPrice: '100'
          }
        ]
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
                <Button variant="light" onClick={() => setAddCompanyShowModal(true)}>Add Company</Button>
                <Button variant="light" onClick={() => setAddCategoryShowModal(true)}>Add Category</Button>
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

              <Modal show={showAddCategoryModal} onHide={() => setAddCategoryShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                  <FloatingLabel label="Category Name" className="mb-1">
                    <Form.Control type="text" placeholder="Category Name" onChange={(e) => setCategoryName(e.target.value)} />
                  </FloatingLabel>

                </Modal.Body>
                <Modal.Footer>
                  <Button variant="success" onClick={addCategory}>Add Category</Button>
                </Modal.Footer>
              </Modal>

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

                  {/* {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="Seçilen Dosya" />}
            {base64Data && <p>Base64 verisi: {base64Data}</p>} */}
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

