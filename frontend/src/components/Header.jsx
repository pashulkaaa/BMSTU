export default function Header() {
    return (
        <header className="header-block">
            <div className="header-block-left-part">
                <img src="/images/logo.jpg" alt="Logo" />
            </div>
            <div className="header-block-right-part">
                <img
                    src="/images/avatar.png" 
                    alt="User Avatar"
                    className="header-block-right-part-avatar"
                />
                <span className="header-block-right-part-name">
                    Оператор связи
                </span>
            </div>
        </header>
    );
}
