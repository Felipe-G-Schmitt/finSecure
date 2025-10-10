import { useState, useEffect } from 'react'

import { Alert } from './Alert'

import { api } from '../services/api'

export function CategoryForm({ fetchCategories, currentCategory, setCurrentCategory }) {
    const [name, setName] = useState('')
    const [type, setType] = useState('despesa')
    const [error, setError] = useState(null)
   
    useEffect(() => {
        if (currentCategory) {
            setName(currentCategory.name)
            setType(currentCategory.type)
        } else {
            setName('')
            setType('despesa')
        }
    }, [currentCategory])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const categoryData = { name, type }

        try {
            if (currentCategory) {
                await api.put(`/categories/${currentCategory.id}`, categoryData)
            } else {
                await api.post('/categories', categoryData)
            }
            fetchCategories()
            handleCancel()
        } catch (error) {
            console.error('Erro ao salvar categoria:', error)
            setError(error?.response?.data?.error?.message || 'Erro ao salvar categoria. Tente novamente.')
        }
    }

    const handleCancel = () => {
        setCurrentCategory(null)
    }

    return (
        <div className="category-form card">
            {error && <Alert message={error} onClose={() => setError(null)} />}
            <h3>{currentCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome da Categoria"
                    required
                />
                <select value={type} onChange={(e) => setType(e.target.value)} required>
                    <option value="despesa">Despesa</option>
                    <option value="receita">Receita</option>
                </select>
                <div className="form-buttons">
                    <button type="submit" className="button button-primary">
                        {currentCategory ? 'Salvar Alterações' : 'Adicionar'}
                    </button>
                    {currentCategory && (
                        <button type="button" className="button" onClick={handleCancel}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
