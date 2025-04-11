import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerBrand}>Proto-on</div>

                <div className={styles.footerLinks}>
                    <a href="/sobre" className={styles.footerLink}>Sobre</a>
                    <a href="/contato" className={styles.footerLink}>Contato</a>
                    <a href="/privacidade" className={styles.footerLink}>Privacidade</a>
                    <a href="/termos" className={styles.footerLink}>Termos</a>
                </div>

                <div className={styles.footerDivider}></div>

                <div className={styles.footerCopyright}>
                    © {new Date().getFullYear()} Proto-on. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
