'use client'
import { useState, useEffect } from 'react';
import { Button, Card, Image, Container, Row, Col, Modal, Navbar } from 'react-bootstrap';
import { db, collection, getDocs } from '@/firebase-config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/asset/scss/categories.scss';

export default function Page({ params }: { params: { id: string } }) {
    const [data, setData] = useState([]);


    useEffect(() => {

        const fetchData = async () => {
            try {
                const companyCol = collection(db, "categories");
                const querySnapshot = await getDocs(companyCol);
                const data = querySnapshot.docs.map((doc) => doc.data());
                console.log('data', data)
                const categoryList = data;
                console.log('categoryList',categoryList)
                const filteredData = categoryList.filter((item) => item.companyId === params.id);

                setData(filteredData);
            } catch (error) {
                console.error("error", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Navbar className="bg-body-tertiary">
                <Navbar.Brand href="#home">
                    LOGO
                    {/* <img
              src="/img/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            /> */}
                </Navbar.Brand>
            </Navbar>
            <Container className='categories'>
                <div className='categories-title'>Category List</div>
                <div className='categories-page'>
                    {data.map((item, index) => (
                        <Card>
                            <Card.Img variant="top" src={item.categoryImage} />
                                <Card.Title className='categories-page-title'> {item.categoryName} </Card.Title>
                        </Card>
                    ))}
                </div>
            </Container>

            {/* params: {params.id}
      <div>
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              <span>Company Name: {item.companyId}</span>
            </li>
          ))}
        </ul>
      </div> */}
        </>
    );
}
