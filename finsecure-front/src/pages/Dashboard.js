import React, { useEffect, useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import api from '../services/api';

import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';

import Balance from '../components/Balance';

import '../styles/Dashboard.css';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const [transactionsResponse, categoriesResponse] = await Promise.all([
                    api.get('/transactions'),
                    api.get('/categories')
                ]);
                setTransactions(transactionsResponse.data.items);
                setCategories(categoriesResponse.data.items);
            } catch (err) {
                console.error("Falha ao buscar dados do dashboard:", err);
                setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const refreshTransactions = async () => {
        try {
            const response = await api.get('/transactions');
            setTransactions(response.data.items);
        } catch (error) {
            console.error('Erro ao atualizar transações:', error);
        }
    };

    if (isLoading) return <div className="container">Carregando...</div>;
    if (error) return <div className="container error-message">{error}</div>;

    return (
        <div className="dashboard container">
            <header className="dashboard-header">
                <h1>Dashboard Financeiro</h1>
                <div className="dashboard-header-actions">
                    <Link to="/categories" className="button link">Gerir Categorias</Link>
                    <button onClick={handleLogout} className="button button-danger">Sair</button>
                </div>
            </header>

            <Balance transactions={transactions} />

            <main className="dashboard-content">
                <TransactionForm categories={categories} fetchTransactions={refreshTransactions} />
                <TransactionList transactions={transactions} />
            </main>
        </div>
    );
};

export default Dashboard;