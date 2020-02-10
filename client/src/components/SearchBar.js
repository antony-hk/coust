import React, { useState } from 'react';

import styles from './SearchBar.module.css';

const SearchBar = () => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <form
            className={styles.searchBar}
            onSubmit={handleSubmit}
        >
            <div className={styles.termInfo} id="termInfo">Loading...</div>
            <div className={styles.inputContainer}>
                <input
                    className={styles.input}
                    id="add"
                    type="text"
                    placeholder="Add Courses to Timetable"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onBlur={() => setInputValue('')}
                />
            </div>
        </form>
    );
};

export default SearchBar;
