import React from 'react';

import getShareLink from '../timetable/getShareLink';

const Aside = (props) => {
    return (
        <div
            style={{
                marginRight: 50,
                float: 'right',
            }}
        >
            <div id="dialog" />
            <div>
                <p><input type="text" id="shareLinkInput" /></p>
                <p id="copyResult"></p>
                <p><button onClick={getShareLink}>Get Share Link</button></p>
                <p>
                    <button
                        id="show-faq"
                        style={{ width: 120 }}
                    >
                        Show FAQ
                    </button>
                </p>
            </div>
            <div>
                <p style={{ fontSize: 10, color: 'gray' }}>
                    {`Data Last Updated: `}
                    <br />
                    <span id="update-time" />
                </p>
            </div>
        </div>
    );
};

export default Aside;
