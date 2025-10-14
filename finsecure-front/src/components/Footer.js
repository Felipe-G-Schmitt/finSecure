   import '../styles/Footer.css'

const devs = [
    {
        name: 'Gustavo',
        githubUser: 'drypzz',
        avatarUrl: 'https://avatars.githubusercontent.com/u/79218936?v=4'
    },
    {
        name: 'Lincoln',
        githubUser: 'function404',
        avatarUrl: 'https://avatars.githubusercontent.com/u/79523461?v=4'
    },
    {
        name: 'Felipe Schmitt',
        githubUser: 'Felipe-G-Schmitt',
        avatarUrl: 'https://avatars.githubusercontent.com/u/79218944?v=4'
    }
]

export function Footer() {
   return (
      <footer className="footer-container">
         <div className="footer-content container">
               <div className="footer-about">
                  <img src={'/logoFinSec500.png'} alt="FinSecure Logo" className="footer-logo" />
                  <p>
                     Seu sistema de controle de finanças pessoais com foco total em segurança. Organize seu dinheiro com a proteção que você merece.
                  </p>
               </div>
               <div className="footer-devs">
                  <h4>Desenvolvido por:</h4>
                  <ul className="devs-list">
                     {devs.map(dev => (
                           <li key={dev.githubUser}>
                              <a href={`https://github.com/${dev.githubUser}`} target="_blank" rel="noopener noreferrer">
                                 <img src={dev.avatarUrl} alt={dev.name} />
                                 <span>{dev.name}</span>
                              </a>
                           </li>
                     ))}
                  </ul>
               </div>
         </div>
         <div className="footer-bottom">
               <p>&copy; {new Date().getFullYear()} FinSecure. Todos os direitos reservados.</p>
         </div>
      </footer>
   )
}