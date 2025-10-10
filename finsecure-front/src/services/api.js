import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true,
})

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    const csrfToken = localStorage.getItem('csrfToken')
    if (csrfToken && ['POST', 'PUT', 'DELETE'].includes(config.method.toUpperCase())) {
        config.headers['x-csrf-token'] = csrfToken
    }

    return config
})

export async function fetchCsrfToken() {
    try {
        const { data } = await api.get('/csrf-token')
        localStorage.setItem('csrfToken', data.csrfToken)
    } catch (error) {
        console.error('Falha ao obter o token CSRF', error)
    }
}
