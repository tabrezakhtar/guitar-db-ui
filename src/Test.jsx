import React, { createContext, useContext, useState, useEffect } from "react";

const Test = () => {
    useEffect(() => {
        const fetchIp = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ip`);
                const data = await res.json();
                console.log(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchIp();
    }, []);

    return (
        <div className="p-4 max-w-sm mx-auto bg-white rounded shadow">
            test page
        </div>
    );
};

export default Test;