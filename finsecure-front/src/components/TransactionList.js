import { useState } from 'react'

import { api } from '../services/api'

import { ReceiptModal } from './ReceiptModal'
import { Alert } from './Alert'

import { useConfirm } from '../contexts/ConfirmationContext'
import { formatMoney } from '../utils/MaskUtils'

import '../styles/Transaction.css'

export function TransactionList({ transactions, onEdit, fetchTransactions }) {
    const [modalFileUrl, setModalFileUrl] = useState(null)
    const [modalFileType, setModalFileType] = useState(null)
    const [isLoadingReceipt, setIsLoadingReceipt] = useState(false)
    const [error, setError] = useState(null)
    const confirm = useConfirm()

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
            console.error("Erro ao buscar o comprovante:", error)
            setError("Não foi possível carregar o comprovante.")
        } finally {
            setIsLoadingReceipt(false)
        }
    }

    const handleDelete = async (id) => {
        const confirmed = await confirm(
            'Confirmar Exclusão',
            'Tem a certeza de que deseja excluir esta transação?'
        )
        if (confirmed) {
            try {
                await api.delete(`/transactions/${id}`)
                fetchTransactions()
            } catch (error) {
                console.error('Erro ao excluir transação:', error)
                setError(error?.response?.data?.error?.message || 'Erro ao excluir transação. Tente novamente.')
            }
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
            {error && <Alert message={error} onClose={() => setError(null)} />}
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
                                            {isLoadingReceipt ? 'Carregando...' : 'Ver comprovante'}
                                        </button>
                                    )}
                                </div>
                                <div className="transaction-actions">
                                    <span className={`value ${transaction.type}`}>
                                        {transaction.type === 'despesa' ? '- ' : '+ '}
                                            {formatMoney(parseFloat(transaction.value))}
                                    </span>
                                    <div className="action-buttons">
                                        <button className="button" onClick={() => onEdit(transaction)}>Editar</button>
                                        <button className="button button-danger" onClick={() => handleDelete(transaction.id)}>Excluir</button>
                                    </div>
                                </div>
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
