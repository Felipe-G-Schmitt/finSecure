import '../styles/ConfirmModal.css'

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
   if (!isOpen) {
      return null
   }

   return (
      <div className="confirm-modal-backdrop">
            <div className="confirm-modal-content card">
               <h3>{title}</h3>
               <p>{message}</p>
               <div className="confirm-modal-actions">
                  <button onClick={onCancel} className="button">
                        Cancelar
                  </button>
                  <button onClick={onConfirm} className="button button-danger">
                        Confirmar
                  </button>
               </div>
            </div>
      </div>
   )
}