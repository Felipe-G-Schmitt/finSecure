import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';

import '../styles/Form.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', { name, email, password });
            navigate('/login');
        } catch (error) {
            console.error('Erro no registo:', error);
            alert('Erro ao registar. Tente novamente.');
        }
    };

    return (
        <div className="form-container">
            <div className="form-box card">
                <h2>Registo</h2>
                <form onSubmit={handleRegister} className="form-content">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
                    />
                    <button type="submit" className="button button-primary">Registar</button>
                </form>
                <p>Já tem uma conta? <a href="/login">Faça login</a></p>
            </div>
        </div>
    );
};

export default Register;