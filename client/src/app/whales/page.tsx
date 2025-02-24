'use client';

import { useEffect, useState } from "react";
import WhaleLink from "../_components/WhaleLink/WhaleLink";

export default function Whales() {
    const API_BASE = 'http://127.0.0.1:5001';

    const [whales, setWhales] = useState([]);
    const [activeStatus, setActiveStatus] = useState('');
    const [activePod, setActivePod] = useState('');

    function handleActiveStatusUpdate(status : string) {
        setActiveStatus(status);
    }

    function handleActivePodUpdate(pod : string) {
        setActivePod(pod);
    }

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`${API_BASE}/whales${activeStatus}${activePod}`);
            setWhales(await res.json());
        }

        fetchData();

    }, [activeStatus, activePod]);

    return (
        <div>
            <div>
                <div>Status</div>
                <ul>
                    <li onClick={() => handleActiveStatusUpdate("")}>All</li>
                    <li onClick={() => handleActiveStatusUpdate("/living")}>Living</li>
                    <li onClick={() => handleActiveStatusUpdate("/deceased")}>Deceased</li>
                </ul>

                <div>Pod</div>
                <ul>
                    <li onClick={() => handleActivePodUpdate("")}>All</li>
                    <li onClick={() => handleActivePodUpdate("/pod/j")}>J Pod</li>
                    <li onClick={() => handleActivePodUpdate("/pod/k")}>K Pod</li>
                    <li onClick={() => handleActivePodUpdate("/pod/l")}>L Pod</li>
                </ul>
            </div>

            <div>
                <h2>Whales</h2>
                <ul>
                    {
                        whales.map((whale, i) => (
                            <li key={i}>
                                <WhaleLink whale={whale}/>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}