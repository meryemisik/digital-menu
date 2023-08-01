'use client'
import { useEffect } from 'react';
import { db, collection, getDocs } from '../../../firebase-config';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/asset/scss/login.scss';

export default function Page() {
  useEffect(() => {
    const fetchData = async () => {
      const companyCol = collection(db, "companies");
      const querySnapshot = await getDocs(companyCol);
      const data = querySnapshot.docs.map((doc) => doc.data());
      console.log('data', data);
    };

    fetchData();
  }, []);


  return (
    <>
      <div className='login'>
        <div className='login-page'>
          <FloatingLabel controlId="floatingInput" label="Email address">
            <Form.Control type="email" placeholder="name@example.com" />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control type="password" placeholder="Password" />
          </FloatingLabel>
          <Button variant="success">Giriş</Button>
        </div>
      </div>
    </>
  );
}
