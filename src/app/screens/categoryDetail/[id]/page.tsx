'use client'
import { useState, useEffect } from 'react';
import { Card, Container, Navbar, Row, Col } from 'react-bootstrap';
import { db, collection, getDocs } from '@/firebase-config';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from '../../../_app'

export default function CategoryDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
      console.log('app', App)
    try {
      const companyCol = collection(db, "categories");
      const querySnapshot = await getDocs(companyCol);
      const data = querySnapshot.docs.map((doc) => doc.data());
      const matchedData = data.find((item) => item.categoryId === params.id);
      setData(matchedData?.itemList || []);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Navbar.Brand href="#home">
          LOGO
        </Navbar.Brand>
      </Navbar>

      <Container>
        <div className='categories-header'>
          <div className='categories-title'>Category Detail List</div>
        </div>
        <Row xs={1} sm={2} md={3} lg={4}>
          {data.map((item) => (
            <Col key={item.itemId}>
              <Link href={`/screens/category/${item.itemId}`}>
                <Card>
                  <Card.Img variant="top" src={item.itemImage} />
                  <Card.Body>
                    <Card.Title>{item.itemName}</Card.Title>
                    <Card.Text>Price: {item.itemPrice}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}