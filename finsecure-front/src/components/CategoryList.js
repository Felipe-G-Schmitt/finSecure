import { useState } from 'react'

import { api } from '../services/api'

import { useConfirm } from '../contexts/ConfirmationContext'

import { Alert } from './Alert'

export function CategoryList({ categories, onEdit, fetchCategories, isLoading }) {
    const [error, setError] = useState(null)
    const confirm = useConfirm()

    const handleDelete = async (id) => {
        const confirmed = await confirm(
            'Confirmar Exclusão',
            'Tem a certeza de que deseja excluir esta categoria?'
        )

        if (confirmed) {
            try {
                await api.delete(`/categories/${id}`)
                fetchCategories()
            } catch (error) {
                console.error('Erro ao excluir categoria:', error)
                setError('Erro ao excluir categoria. Verifique se não está a ser utilizada por alguma transação.')
            }
        }
    }

    if (isLoading) {
        return <div className="card"><p>A carregar categorias...</p></div>
    }

    return (
        <div className="category-list card">
            {error && <Alert message={error} onClose={() => setError(null)} />}
            <h3>Categorias Existentes</h3>
            <ul>
                {categories && categories.length > 0 ? (
                    categories.map(({ category }) => (
                        <li key={category.id}>
                            <div className="category-details">
                                <span className="category-name">{category.name}</span>
                                <span className={`category-type type-${category.type}`}>
                                    {category.type}
                                </span>
                            </div>
                            <div className="category-actions">
                                <button className="button" onClick={() => onEdit(category)}>Editar</button>
                                <button className="button button-danger" onClick={() => handleDelete(category.id)}>Excluir</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>Nenhuma categoria encontrada.</p>
                )}
            </ul>
        </div>
    )
}
