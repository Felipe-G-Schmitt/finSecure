import '../styles/ReceiptModal.css'

export function ReceiptModal({ fileUrl, fileType, onClose }) {
    if (!fileUrl) {
        return null
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const renderContent = () => {
        if (fileType && fileType.startsWith('image/')) {
            return <img src={fileUrl} alt="Comprovante da Transação" />
        }
        if (fileType === 'application/pdf') {
            return (
                <object data={fileUrl} type="application/pdf" width="100%" height="100%">
                    <p>O seu navegador não possui um plugin para PDF. Pode <a href={fileUrl}>clicar aqui para descarregar o PDF.</a></p>
                </object>
            )
        }
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Não é possível exibir este tipo de ficheiro diretamente.</p>
                <a href={fileUrl} download="Comprovante" className="button">Clique aqui para descarregar o ficheiro</a>
            </div>
        )
    }

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                {renderContent()}
            </div>
            <button className="modal-close-button" onClick={onClose}>
                &times;
            </button>
        </div>
    )
}
