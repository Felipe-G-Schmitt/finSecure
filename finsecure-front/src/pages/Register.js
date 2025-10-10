import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { api } from '../services/api'

import { Alert } from '../components/Alert'

import '../styles/Form.css'

export function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            await api.post('/register', { name, email, password })
            navigate('/login')
        } catch (error) {
            console.error('Erro no registo:', error)
            setError('Erro ao registar. Tente novamente.')
        }
    }

    return (
        <div className="form-container">
            {error && <Alert message={error} onClose={() => setError(null)} />}
            <div className="form-box card">
                <h2>Registro</h2>
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
                    <button type="submit" className="button button-primary">Registrar</button>
                </form>
                <p>Já tem uma conta? <a href="/login">Faça login</a></p>
            </div>
        </div>
    )
}
