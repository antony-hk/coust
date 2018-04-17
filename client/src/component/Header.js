import React from 'react';

export default class Header extends React.PureComponent {
    _handleSubmit = (event) => {
        event.preventDefault();
    }

    render() {
        return (
            <React.Fragment>
                <header>
                    <div className="container">
                        <a className="logo" href="." />
                        <div id="searchBar">
                            <form onSubmit={this._handleSubmit}>
                                <ul>
                                    <li id="termInfo">Loading...</li>
                                    <li>
                                        <input
                                            id="add"
                                            type="text"
                                            placeholder="Add Courses to Timetable"
                                        />
                                    </li>
                                </ul>
                            </form>
                        </div>
                    </div>
                </header>
                <div className="headerFix" />
            </React.Fragment>
        );
    }
}