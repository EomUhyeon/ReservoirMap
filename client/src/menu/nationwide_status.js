import React, { useEffect, useState } from "react";
import statusData from './data/korea_today_percent.json';

function NationwideStatus() {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(statusData);
    }, []);

    return (
        <div className="status-container">
            <table className="status-table">
                <thead>
                    <tr>
                        <th>지역</th>
                        <th>금일 저수율</th>
                        <th>전일 저수율</th>
                        <th>전년 저수율</th>
                        <th>평년 저수율</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.금일}%</td>
                            <td>{item.전일}%</td>
                            <td>{item.전년}%</td>
                            <td>{item.평년}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default NationwideStatus;
