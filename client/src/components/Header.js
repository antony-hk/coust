import React from 'react';

import SearchBar from './SearchBar';

import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <a className={styles.logo} href=".">
                    <span className={styles.siteName}>CoUST</span>
                </a>
                <SearchBar />
            </div>
        </header>
    );
};

export default Header;
