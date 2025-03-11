export default function Footer() {
    const currentYear = new Date().getFullYear();
    return <footer className="footer-block">ТРВП-002.  ©{currentYear} Все парава защищены.</footer>;
}
