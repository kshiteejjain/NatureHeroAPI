import React from 'react';
import axios from 'axios';

interface Image {
    name: string;
    url: string;
    gender: string;
    ageRange: string;
}

interface ImageListProps {
    images: Image[];
    onDelete: (name: string) => void;
}

const ImageList: React.FC<ImageListProps> = ({ images, onDelete }) => {
    const handleDelete = async (name: string) => {
        try {
            if (confirm('Are you sure you want to delete this image?')) {
                await axios.delete(`http://localhost:3001/images/${name}`);
                onDelete(name);
                alert("Image deleted successfully.");
                window.location.reload();
            } else {
                alert("Image deletion canceled.");
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('An error occurred while trying to delete the image.');
        }
    };

    return (
        <>
            <div className='image-list'>
                <h2>Available Images</h2>
                {images.length === 0 ? (
                    <p>No images found</p>
                ) : (
                    images.map((image, index) => (
                        <div className='image-area' key={index}>
                            <img
                                src={image.url}
                                alt={image.name} />
                            <p>Name: {image.name}</p>
                            <p>Gender: {image.gender}</p>
                            <p>Age Range: {image.ageRange}</p>
                            <button className='btn-danger' onClick={() => handleDelete(image.name)}>Delete</button>
                        </div>
                    ))
                )}
            </div></>
    );
};

export default ImageList;
