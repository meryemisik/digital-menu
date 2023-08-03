'use client'
import { Button, Card, Container, Modal, Navbar, Form, FloatingLabel, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function Page({ params }: { params: { id: string } }) {

    return (
        <>
            <Navbar className="bg-body-tertiary">
                <Navbar.Brand href="#home">
                    LOGO
                </Navbar.Brand>
            </Navbar>
            Params : {params.id}


            
        </>
    );
}