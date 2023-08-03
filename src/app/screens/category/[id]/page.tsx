'use client'
import { useState, useEffect, ChangeEvent } from 'react';
import { Button, Card, Container, Modal, Navbar, Form, FloatingLabel, Accordion } from 'react-bootstrap';
import { db, collection, getDocs, addDoc, getFirestore } from '@/firebase-config';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/asset/scss/categories.scss';
export default function Page({ params }: { params: { id: string } }) {
    const [data, setData] = useState<any[]>([]);
    const [showAddCategoryModal, setAddCategoryShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [base64Data, setBase64Data] = useState('');
    const [base64Item, setBase64Item] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedItemImage, setSelectedItemImage] = useState<File | null>(null);
    const [count, setCount] = useState(0);
    const [itemNames, setItemNames] = useState<string[]>([]);
    const [itemPrices, setItemPrices] = useState<string[]>([]);


    const handleItemNameChange = (value: string, index: number) => {
        const newItemNames = [...itemNames];
        newItemNames[index] = value;
        setItemNames(newItemNames);
    };

    const handleItemPriceChange = (value: string, index: number) => {
        const newItemPrices = [...itemPrices];
        newItemPrices[index] = value;
        setItemPrices(newItemPrices);
    };

    const changeCategoryImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64Data(reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    const changeItemImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        setSelectedItemImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64Item(reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    const addCategory = async () => {
        var newCategoryId = `${Math.floor(Math.random() * Math.pow(10, 15))}`;
        try {
            const db = getFirestore();
            const categoryRef = collection(db, 'categories');
            const newItemList = [...Array(count)].map((_, index) => ({
                itemId: `${Math.floor(Math.random() * Math.pow(10, 15))}`,
                itemImage: base64Item,
                itemName: itemNames[index] || '',
                itemPrice: itemPrices[index] || '',
            }));
            await addDoc(categoryRef, {
                categoryId: newCategoryId,
                categoryImage: base64Data,
                categoryName: categoryName,
                companyId: params.id,
                itemList: newItemList,
            });
        } catch (error) {
            console.error('Kaydetme hatası:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companyCol = collection(db, "categories");
                const querySnapshot = await getDocs(companyCol);
                const data = querySnapshot.docs.map((doc) => doc.data());
                const categoryList = data;
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
                </Navbar.Brand>
            </Navbar>
            <Container className='categories'>
                <div className='categories-header'>
                    <div className='categories-title'>Category List</div>
                    <Button variant="light" onClick={() => setAddCategoryShowModal(true)}>Add Category</Button>
                </div>
                <div className='categories-page'>
                    {data.map((item, index) => (
                        <Link className='company-page-link' href={`/screens/categoryDetail/${item.categoryId}`}>
                            <Card>
                                <Card.Img variant="top" src={item.categoryImage} />
                                <Card.Title className='categories-page-title'> {item.categoryName} </Card.Title>
                            </Card>
                        </Link>

                    ))}
                </div>
            </Container>


            <Modal show={showAddCategoryModal} onHide={() => setAddCategoryShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <FloatingLabel label="Category Name" className="mb-1">
                        <Form.Control type="text" placeholder="Category Name" onChange={(e) => setCategoryName(e.target.value)} />
                    </FloatingLabel>
                    <FloatingLabel label="Category Image" className="mb-1">
                        <Form.Control type="file" onChange={changeCategoryImage} />
                    </FloatingLabel>
                    <Button onClick={() => setCount(count + 1)}>Add Item</Button>
                    <Accordion defaultActiveKey="0">
                        {[...Array(count)].map((_, index) => (
                            <Accordion.Item key={index} eventKey={String(index)}>
                                <Accordion.Header> {itemNames[index] || 'Item Name'} </Accordion.Header>
                                <Accordion.Body>
                                    <FloatingLabel label="Item Name" className="mb-1">
                                        <Form.Control type="text" placeholder="Item Name" onChange={(e) => handleItemNameChange(e.target.value, index)} />
                                    </FloatingLabel>
                                    <FloatingLabel label="Item Price" className="mb-1">
                                        <Form.Control type="text" placeholder="Item Price" onChange={(e) => handleItemPriceChange(e.target.value, index)} />
                                    </FloatingLabel>
                                    <FloatingLabel label="Item Image" className="mb-1">
                                        <Form.Control type="file" onChange={changeItemImage} />
                                    </FloatingLabel>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={addCategory}>Add Category</Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}
