import { useContext, useEffect, useRef, useState } from 'react';
import $ from 'jquery';

import DataContext from '../context';
import addCourse from '../timetable/addCourse';

import styles from './SearchBar.module.css';

const SearchBar = () => {
    const data = useContext(DataContext);
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        const inputEl = inputRef.current;
        $(inputEl).autocomplete({
            // source: "http://coust.442.hk/json/parser.php?type=searchHints",
            source: window.searchHints,
            minLength: 0,
            focus: (event, ui) => {
                event.preventDefault();
            },
            select: (event, ui) => {
                event.preventDefault();
                const courseCode = ui.item.value.split(': ')[0];
                addCourse(data, courseCode);
                setInputValue('');
            },
        });
    }, [data]);

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
                    ref={inputRef}
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
