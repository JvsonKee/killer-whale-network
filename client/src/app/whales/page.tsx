'use client';

import { useEffect, useState } from "react";
import WhaleLink from "../_components/WhaleLink/WhaleLink";
import NetworkGraph from "../_components/NetworkGraph/NetworkGraph";
import { Link } from '@/app/types/link';
import { Whale } from '@/app/types/whale';
import './whales.css'

export default function Whales() {
    const API_BASE = 'http://127.0.0.1:5001';

    const [whales, setWhales] = useState<Whale[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [activeStatus, setActiveStatus] = useState('');
    const [activePod, setActivePod] = useState('');
    const [loading, setLoading] = useState(true);

    const data = {
        whales,
        links
    }

    function handleActiveStatusUpdate(status : string) {
        setActiveStatus(status);
    }

    function handleActivePodUpdate(pod : string) {
        setActivePod(pod);
    }

    useEffect(() => {
        async function fetchData() {
            const whalesRes = await fetch(`${API_BASE}/whales${activeStatus}${activePod}`);
            setWhales(await whalesRes.json());

            const linksRes = await fetch(`${API_BASE}/network-edges`);
            setLinks(await linksRes.json());

            setLoading(false);
        }

        fetchData();


    }, [activeStatus, activePod]);

    console.log(loading)

    if (loading) return;

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
                <div className="network-container">
                    <NetworkGraph data={data} />
                </div>
{/*                <ul>
                    {
                        whales.map((whale, i) => (
                            <li key={i}>
                                <WhaleLink whale={whale}/>
                            </li>
                        ))
                    }
                </ul>
*/}
            </div>
        </div>
    )
}
