import {
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useSelector } from 'react-redux';
import $ from 'jquery';

import DataContext from '../context';
import addCourse from '../timetable/addCourse';

import styles from './SearchBar.module.css';

const SearchBar = () => {
    const data = useContext(DataContext);
    const timetable = useSelector(state => (state.app.timetable));
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');

    const searchHints = useMemo(() => {
        if (!data) {
            return [];
        }

        const ret = [];
        Object.entries(data).forEach(([courseCode, value]) => {
            if (courseCode === 'terms' || courseCode === 'lastUpdated') {
                return;
            }
            if (timetable.hasOwnProperty(courseCode)){
                return;
            }
            ret.push(`${courseCode}: ${value.name}`);
        });
        ret.sort();

        return ret;
    }, [data, timetable]);

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        const inputEl = inputRef.current;
        $(inputEl).autocomplete({
            source: searchHints,
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
    }, [data, searchHints]);

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
