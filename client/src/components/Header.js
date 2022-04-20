
import SearchBar from './SearchBar';

import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <a className={styles.logo} href=".">
                    <span className={styles.siteName}>CoUST</span>
                </a>
                <div className={styles.searchBarContainer}>
                    <SearchBar />
                </div>
            </div>
        </header>
    );
};

export default Header;
