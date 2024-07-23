import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('atalBGarden');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'nature@001**India') {
            localStorage.setItem('username', username);
            onLogin(username);
            navigate('/ImageList');
        } else {
            alert('Invalid password');
        }
    };

    return (
        <>
            <form className="form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className="btn-primary">Login</button>
            </form>
        </>
    );
};

export default Login;
