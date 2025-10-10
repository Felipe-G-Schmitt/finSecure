import '../styles/Alert.css'

export function Alert({ message, type = 'error', onClose }) {
   if (!message) {
      return null
   }

   return (
      <div className={`alert-container alert-${type}`}>
         <div className="alert-content">
               <p>{message}</p>
               <button onClick={onClose} className="alert-close-button">
                  &times;
               </button>
         </div>
      </div>
   )
}