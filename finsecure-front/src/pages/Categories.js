import { useState, useEffect } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { api } from '../services/api'

import { CategoryList } from '../components/CategoryList'
import { CategoryForm } from '../components/CategoryForm'
import { LoadingSpinner } from '../components/LoadingSpinner'

import '../styles/Category.css'

export function Categories() {
    const [categories, setCategories] = useState([])
    const [currentCategory, setCurrentCategory] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            setIsLoading(true)
            const response = await api.get('/categories')
            setCategories(response.data.items)
        } catch (error) {
            console.error('Erro ao buscar categorias:', error)
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleEdit = (category) => {
        setCurrentCategory(category)
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="category-page container">
            <header className="category-header">
                <h1>Gerenciar Categorias</h1>
                <Link to="/dashboard" className="button link">Voltar ao Dashboard</Link>
            </header>

            <main className="category-content">
                <CategoryForm
                    fetchCategories={fetchCategories}
                    currentCategory={currentCategory}
                    setCurrentCategory={setCurrentCategory}
                />
                <CategoryList
                    categories={categories}
                    onEdit={handleEdit}
                    fetchCategories={fetchCategories}
                    isLoading={isLoading}
                />
            </main>
        </div>
    )
}