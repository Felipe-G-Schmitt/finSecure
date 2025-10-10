import { createContext, useState, useCallback, useContext } from 'react'
import { ConfirmModal } from '../components/ConfirmModal'

const ConfirmationContext = createContext()

export function useConfirm() {
   const context = useContext(ConfirmationContext)
   if (!context) {
      throw new Error('useConfirm must be used within a ConfirmationProvider')
   }
   return context
}

export function ConfirmationProvider({ children }) {
   const [options, setOptions] = useState(null)
   const [resolve, setResolve] = useState(null)

   const confirm = useCallback((title, message) => {
      return new Promise((resolve) => {
         setOptions({ title, message })
         setResolve(() => resolve)
      })
   }, [])

   const handleConfirm = () => {
      if (resolve) {
         resolve(true)
      }
      setOptions(null)
   }

   const handleCancel = () => {
      if (resolve) {
         resolve(false)
      }
      setOptions(null)
   }

   return (
      <ConfirmationContext.Provider value={confirm}>
         {children}
         <ConfirmModal
            isOpen={options !== null}
            title={options?.title}
            message={options?.message}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
         />
      </ConfirmationContext.Provider>
   )
}