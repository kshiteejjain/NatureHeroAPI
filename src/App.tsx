import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './features/Login';
import ImageUpload from './features/ImageUpload';
import ImageList from './features/ImageList';
import Header from './components/Header/Header';

import './App.css';

interface Image {
    name: string;
    url: string;
    gender: string;
    ageRange: string;
}

const App: React.FC = () => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [images, setImages] = useState<Image[]>([]);

    const fetchImages = async () => {
        try {
            const response = await axios.get<Image[]>('https://nature-hero-api.vercel.app/images');
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    useEffect(() => {
        if (username) {
            fetchImages();
        }
    }, [username]);

    const handleLogin = (username: string) => {
        setUsername(username);
        localStorage.setItem('username', username);
    };

    const handleImageUpload = () => {
        fetchImages();
    };

    const handleDeleteImage = async (name: string) => {
        try {
            await axios.delete(`http://localhost:3001/images/${name}`);
            setImages(prevImages => prevImages.filter(image => image.name !== name));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        setUsername(null);
    };

    return (
        <Router>
            <Header onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Login onLogin={handleLogin} />} />
                {username ? (
                    <>
                        <Route path="/ImageUpload" element={<ImageUpload onUploadSuccess={handleImageUpload} />} />
                        <Route path="/ImageList" element={<ImageList images={images} onDelete={handleDeleteImage} />} />
                        <Route path="*" element={<Navigate to="/ImageList" />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/" />} />
                )}
            </Routes>
        </Router>
    );
};

export default App;
