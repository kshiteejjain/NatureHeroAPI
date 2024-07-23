import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ImageUploadProps {
    onUploadSuccess: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        ageRange: '',
        file: null as File | null,
    });
    const [isSucceeded, setIsSucceeded] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setIsSucceeded(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prevState => ({
            ...prevState,
            file
        }));
        setIsSucceeded(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.file) {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('gender', formData.gender);
            data.append('ageRange', formData.ageRange);
            data.append('image', formData.file);

            try {
                await axios.post('http://localhost:3001/upload', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                onUploadSuccess();
                setFormData({
                    name: '',
                    gender: '',
                    ageRange: '',
                    file: null,
                });
                setIsSucceeded(true);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    return (
        <>
            <form className="form" onSubmit={handleSubmit}>
                <h2>Image Upload</h2>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Image Name"
                    required
                />
                <div className="radio">
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleInputChange}
                            required
                        />
                        Male
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleInputChange}
                            required
                        />
                        Female
                    </label>
                </div>
                <select
                    name="ageRange"
                    value={formData.ageRange}
                    onChange={handleInputChange}
                    required
                >
                    <option value="" disabled>
                        Select age range
                    </option>
                    <option value="5-15">5-15 years</option>
                    <option value="16-30">16-30 years</option>
                    <option value="30-50">30-50 years</option>
                </select>
                <input
                    type="file"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit" className="btn-primary">Upload</button>
            </form>
            {isSucceeded && <p className='success'>Image Uploaded Successfully, <a href='javascript:void(0)' onClick={()=> navigate('/ImageList')}>Click Here</a> to confirm</p>}
        </>
    );
};

export default ImageUpload;
