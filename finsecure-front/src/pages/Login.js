import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { Alert } from '../components/Alert'
import '../styles/Form.css'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await api.post('/login', { email, password })
            navigate('/dashboard')
        } catch (error) {
            console.error('Erro no login:', error)
            setError(error.response?.data?.error?.message || 'Erro no login. Tente novamente.')
        }
    }

    return (
        <div className="form-container">
            {error && <Alert message={error} onClose={() => setError(null)} />}
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
                <p>Não tem uma conta? <a href="/register">Registre-se</a></p>
            </div>
        </div>
    )
}