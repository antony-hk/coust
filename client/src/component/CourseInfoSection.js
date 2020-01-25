import React from 'react';

const CourseInfoSection = (props) => {
    return (
        <React.Fragment>
            <div
                id="tba-courses-div"
                style={{
                    color: 'gray',
                    fontSize: 14,
                    marginLeft: 50,
                }}
            >
                {`Courses with "TBA" date & time: `}
                <span id="no-tba">None</span>
                <span id="tba-courses"></span>
            </div>
            <table id="timetable_controls">
                <thead>
                <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
                <tr id="none">
                    <td colspan="3">No courses added.</td>
                </tr>
                </thead>
                <tbody id="courselist">
                </tbody>
            </table>
        </React.Fragment>
    );
};

export default CourseInfoSection;
