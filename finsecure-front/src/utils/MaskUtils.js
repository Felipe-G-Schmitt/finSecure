export const formatMoney = (val) => {
   if (!val) {
      return 'R$ 0,00'
   }

   if (val === -1) {
      return '--,--'
   }

   return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
   })
}