import React from 'react';

const Faq = (props) => {
    return (
        <div
            title="FAQ"
            id="faq"
            style={{
                display: 'none',
                lineHeight: '25px',
                textAlign: 'left',
                padding: '20px 20px',
                fontSize: 15,
            }}
        >
            <p>
                <div><strong>Q:</strong> Is data always up-to-date?</div>
                <div><strong>A:</strong> No, data have to be manually updated by running <a style={{color: 'darkblue'}} target="_blank" href="//coust.442.hk/json/mkdata.php">this page</a> to obtain and save data from <a style={{ color: 'darkblue' }} target="_blank" href="https://w5.ab.ust.hk/wcq/cgi-bin/">HKUST Class Schedule and Quota</a> by crawling and parsing the website, i.e. data are correct up to the latest time of running the data retrieving page.</div>
            </p>
            <p>
                <div><strong>Q:</strong> What is READ-ONLY Mode?</div>
                <div><strong>A:</strong> In READ-ONLY Mode, you can only view the timetable. And your original timetable in non read mode will not be affected. You may exit read mode and view your own timetable by clicking the logo (which returns to the home page).</div>
            </p>
            <p>
                <div><strong>Q:</strong> Does the web app supports all browsers?</div>
                <div><strong>A:</strong> No, the web app uses jQuery and thus requires browser version supporting jQuery (e.g. IE9+).</div>
            </p>
            <p>
			    <div><strong>If you any enquires, please find us on <a href="https://www.facebook.com/CoUST.HK">our Facebook page</a>.</strong></div>
			</p>
            <p>
                <div><strong>GitHub:</strong> <a target="_blank" href="https://github.com/antonytse/CoUST">https://github.com/antonytse/CoUST</a></div>
            </p>
            <p>
                <div><strong>Authors:</strong> Alan Chung, Antony Tse</div>
            </p>
        </div>
    );
};

export default Faq;
