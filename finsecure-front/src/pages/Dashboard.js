import { useEffect, useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'
import { TransactionList } from '../components/TransactionList'
import { TransactionForm } from '../components/TransactionForm'
import { Balance } from '../components/Balance'
import { Alert } from '../components/Alert'
import { ThemeContext } from '../contexts/ThemeContext'
import '../styles/Dashboard.css'
import { Sun, Moon } from '../components/Icons'

export function Dashboard() {
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [currentTransaction, setCurrentTransaction] = useState(null)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { theme, toggleTheme } = useContext(ThemeContext)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const [transactionsResponse, categoriesResponse] = await Promise.all([
                    api.get('/transactions'),
                    api.get('/categories')
                ])
                setTransactions(transactionsResponse.data.items)
                setCategories(categoriesResponse.data.items)
            } catch (err) {
                console.error("Falha ao buscar dados do dashboard:", err)
                setError("Não foi possível carregar os dados. Tente novamente mais tarde.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const refreshTransactions = async () => {
        try {
            const response = await api.get('/transactions')
            setTransactions(response.data.items)
        } catch (error) {
            console.error('Erro ao atualizar transações:', error)
            setError("Erro ao atualizar transações.")
        }
    }

    const handleEdit = (transaction) => {
        setCurrentTransaction(transaction)
    }

    if (isLoading) return <div className="container">Carregando...</div>

    return (
        <div className="dashboard container">
            {error && <Alert message={error} onClose={() => setError(null)} />}
            <header className="dashboard-header">
                <h1>Dashboard Financeiro</h1>
                <div className="dashboard-header-actions">
                    <button onClick={toggleTheme} className="button theme-toggle-button">
                        {theme === 'light' ? <Moon /> : <Sun />}
                    </button>
                    <Link to="/categories" className="button link">Gerenciar Categorias</Link>
                    <button onClick={handleLogout} className="button button-danger">Sair</button>
                </div>
            </header>

            <Balance transactions={transactions} />

            <main className="dashboard-content">
                <TransactionForm
                    categories={categories}
                    fetchTransactions={refreshTransactions}
                    currentTransaction={currentTransaction}
                    setCurrentTransaction={setCurrentTransaction}
                />
                <TransactionList
                    transactions={transactions}
                    onEdit={handleEdit}
                    fetchTransactions={refreshTransactions}
                />
            </main>
        </div>
    )
}
