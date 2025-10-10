import { useState, useMemo, useEffect } from 'react'

import { api } from '../services/api'

import { Alert } from './Alert'

import '../styles/Transaction.css'

export function TransactionForm({ categories, fetchTransactions, currentTransaction, setCurrentTransaction }) {
    const [description, setDescription] = useState('')
    const [value, setValue] = useState('')
    const [date, setDate] = useState('')
    const [type, setType] = useState('despesa')
    const [categoryId, setCategoryId] = useState('')
    const [receipt, setReceipt] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (currentTransaction) {
            setDescription(currentTransaction.description)
            setValue(currentTransaction.value)
            setDate(currentTransaction.date)
            setType(currentTransaction.type)
            setCategoryId(currentTransaction.categoryId)
        } else {
            resetForm()
        }
    }, [currentTransaction])

    const filteredCategories = useMemo(() => {
        if (!Array.isArray(categories)) return []
        return categories.filter(({ category }) => category.type === type)
    }, [type, categories])

    const handleFileChange = (e) => {
        setReceipt(e.target.files[0])
    }

    const resetForm = () => {
        setDescription('')
        setValue('')
        setDate('')
        setType('despesa')
        setCategoryId('')
        setReceipt(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('description', description)
        formData.append('value', parseFloat(value))
        formData.append('date', date)
        formData.append('type', type)
        formData.append('categoryId', categoryId)
        if (receipt) {
            formData.append('receipt', receipt)
        }

        try {
            if (currentTransaction) {
                await api.put(`/transactions/${currentTransaction.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            } else {
                await api.post('/transactions', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            }
            fetchTransactions()
            handleCancel()
        } catch (error) {
            console.error('Erro ao salvar transação:', error)
            setError('Erro ao salvar transação.')
        }
    }

    const handleCancel = () => {
        setCurrentTransaction(null)
        resetForm()
    }

    const handleTypeChange = (e) => {
        setType(e.target.value)
        setCategoryId('')
    }

    return (
        <div className="transaction-form card">
            {error && <Alert message={error} onClose={() => setError(null)} />}
            <h3>{currentTransaction ? 'Editar Transação' : 'Nova Transação'}</h3>
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
                <div className="form-buttons">
                    <button type="submit" className="button button-primary" disabled={filteredCategories.length === 0}>
                        {currentTransaction ? 'Salvar Alterações' : 'Adicionar'}
                    </button>
                    {currentTransaction && (
                        <button type="button" className="button" onClick={handleCancel}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
