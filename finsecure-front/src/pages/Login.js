import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';

import '../styles/Form.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Falha no login. Verifique as suas credenciais.');
        }
    };

    return (
        <div className="form-container">
            <div className="form-box card">
                <h2>Login</h2>
                <form onSubmit={handleLogin} className="form-content">
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
                    <button type="submit" className="button button-primary">Entrar</button>
                </form>
                <p>Não tem uma conta? <a href="/register">Registe-se</a></p>
            </div>
        </div>
    );
};

export default Login;