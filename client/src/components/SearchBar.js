import React from 'react';

import styles from './SearchBar.module.css';

const SearchBar = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <div className={styles.searchBar}>
            <form onSubmit={handleSubmit}>
                <ul>
                    <li className={styles.termInfo} id="termInfo">Loading...</li>
                    <li>
                        <input
                            className={styles.input}
                            id="add"
                            type="text"
                            placeholder="Add Courses to Timetable"
                        />
                    </li>
                </ul>
            </form>
        </div>
    );
};

export default SearchBar;
