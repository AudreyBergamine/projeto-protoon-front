import styles from './Footer.module.css';

function Footer() {
    return (
        <div>
            {/* <footer className="footer">
                © {new Date().getFullYear()} Proto-on. Todos os direitos reservados.
            </footer> */}
            {/* Rodapé */}
            <footer className={styles.footer}>
                <p>© {new Date().getFullYear()} Prefeitura Municipal - Todos os direitos reservados</p>
            </footer>
        </div>
    );
}

export default Footer;
