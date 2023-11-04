import { useContext, useState } from 'react';
import DataContext from '../context';

import styles from './SearchBar.module.css';

const SearchBar = () => {
    const data = useContext(DataContext);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <form
            className={styles.searchBar}
            onSubmit={handleSubmit}
        >
            <div className={styles.termInfo}>
                {data?.terms?.current?.text || 'Loading...'}
            </div>
            <div className={styles.inputContainer}>
                <input
                    className={styles.input}
                    id="add"
                    type="text"
                    placeholder="Add Courses to Timetable"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onBlur={() => setInputValue('')}
                    disabled={!data}
                />
            </div>
        </form>
    );
};

export default SearchBar;
