import { useState } from 'react'

import { api } from '../services/api'

import { ReceiptModal } from './ReceiptModal'

import '../styles/Transaction.css'

export function TransactionList({ transactions }) {
    const [modalFileUrl, setModalFileUrl] = useState(null)
    const [modalFileType, setModalFileType] = useState(null)
    const [isLoadingReceipt, setIsLoadingReceipt] = useState(false)

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
        return new Date(dateString).toLocaleDateString('pt-BR', options)
    }

    const handleViewReceipt = async (receiptUrl) => {
        setIsLoadingReceipt(true)
        try {
            const response = await api.get(receiptUrl, {
                responseType: 'blob',
            })
            const fileType = response.data.type
            const fileUrl = URL.createObjectURL(response.data)
            setModalFileUrl(fileUrl)
            setModalFileType(fileType)
        } catch (error) {
            console.error("Erro ao buscar o comprovativo:", error)
            alert("Não foi possível carregar o comprovativo.")
        } finally {
            setIsLoadingReceipt(false)
        }
    }

    const handleCloseModal = () => {
        if (modalFileUrl) {
            URL.revokeObjectURL(modalFileUrl)
        }
        setModalFileUrl(null)
        setModalFileType(null)
    }

    return (
        <>
            <div className="transaction-list card">
                <h3>Últimas Transações</h3>
                <ul>
                    {transactions && transactions.length > 0 ? (
                        transactions.map(({ transaction }) => (
                            <li key={transaction.id}>
                                <div className="transaction-details">
                                    <span className="description">{transaction.description}</span>
                                    <small className="date">{formatDate(transaction.date)}</small>
                                    {transaction.receiptUrl && (
                                        <button
                                            className="receipt-link-button"
                                            onClick={() => handleViewReceipt(transaction.receiptUrl)}
                                            disabled={isLoadingReceipt}
                                        >
                                            {isLoadingReceipt ? 'Carregando...' : 'Ver Comprovativo'}
                                        </button>
                                    )}
                                </div>
                                <span className={`value ${transaction.type}`}>
                                    {transaction.type === 'despesa' ? '- ' : '+ '}
                                    R$ {parseFloat(transaction.value).toFixed(2)}
                                </span>
                            </li>
                        ))
                    ) : (
                        <p>Nenhuma transação encontrada.</p>
                    )}
                </ul>
            </div>
            <ReceiptModal
                fileUrl={modalFileUrl}
                fileType={modalFileType}
                onClose={handleCloseModal}
            />
        </>
    )
}
