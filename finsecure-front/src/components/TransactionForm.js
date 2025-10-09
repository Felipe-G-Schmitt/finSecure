import React, { useState, useMemo } from 'react';

import api from '../services/api';

import '../styles/Transaction.css';

const TransactionForm = ({ categories, fetchTransactions }) => {
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('despesa');
    const [categoryId, setCategoryId] = useState('');
    const [receipt, setReceipt] = useState(null);

    const filteredCategories = useMemo(() => {
        if (!Array.isArray(categories)) return [];
        return categories.filter(({ category }) => category.type === type);
    }, [type, categories]);

    const handleFileChange = (e) => {
        setReceipt(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('description', description);
        formData.append('value', parseFloat(value));
        formData.append('date', date);
        formData.append('type', type);
        formData.append('categoryId', categoryId);
        if (receipt) {
            formData.append('receipt', receipt);
        }

        try {
            await api.post('/transactions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchTransactions();
            setDescription('');
            setValue('');
            setDate('');
            setType('despesa');
            setCategoryId('');
            setReceipt(null);
            e.target.reset();
        } catch (error) {
            console.error('Erro ao criar transação:', error);
            alert('Erro ao adicionar transação.');
        }
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
        setCategoryId('');
    }

    return (
        <div className="transaction-form card">
            <h3>Nova Transação</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" required />
                <input type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Valor" required />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <select value={type} onChange={handleTypeChange}>
                    <option value="despesa">Despesa</option>
                    <option value="receita">Receita</option>
                </select>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required disabled={filteredCategories.length === 0}>
                    <option value="">
                        {filteredCategories.length > 0
                            ? 'Selecione a Categoria'
                            : `Crie uma categoria de '${type}' primeiro`}
                    </option>
                    {filteredCategories.map(({ category }) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <div>
                    <label htmlFor="receipt-upload">Comprovativo (Opcional)</label>
                    <input id="receipt-upload" type="file" onChange={handleFileChange} />
                </div>
                <button type="submit" className="button button-primary" disabled={filteredCategories.length === 0}>Adicionar</button>
            </form>
        </div>
    );
};

export default TransactionForm;