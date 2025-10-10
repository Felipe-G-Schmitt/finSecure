import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useState, useCallback, useMemo, useEffect } from 'react'

import { ThemeContext } from './contexts/ThemeContext'
import { ConfirmationProvider } from './contexts/ConfirmationContext'

import { Footer } from './components/Footer'
import { LoadingSpinner } from './components/LoadingSpinner'

import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Categories } from './pages/Categories'

function App() {
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme')
        return storedTheme || 'light'
    })
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000);

        return () => clearTimeout(timer);
    }, [])


    useEffect(() => {
        document.body.classList.toggle('dark-mode', theme === 'dark')
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
    }, [])

    const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

    const PrivateRoute = ({ children }) => {
        return children;
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <ThemeContext.Provider value={themeValue}>
            <ConfirmationProvider>
                <Router>
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <main style={{ flex: 1 }}>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <PrivateRoute>
                                            <Dashboard />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/categories"
                                    element={
                                        <PrivateRoute>
                                            <Categories />
                                        </PrivateRoute>
                                    }
                                />
                                <Route path="*" element={<Navigate to="/login" />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </ConfirmationProvider>
        </ThemeContext.Provider>
    )
}

export default App