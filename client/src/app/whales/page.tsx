'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WhaleLink from "../_components/WhaleLink/WhaleLink";
import NetworkGraph from "../_components/NetworkGraph/NetworkGraph";
import { Link } from '@/app/types/link';
import { Whale } from '@/app/types/whale';
import './whales.css';

export default function Whales() {
    const [whales, setWhales] = useState<Whale[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = 'http://127.0.0.1:5001';

    const router = useRouter();
    const searchParams = useSearchParams();

    const activeStatus = searchParams.get('status') || 'all';
    const activePods = searchParams.getAll('pod');

    /*
     * updates the active status search parameter.
     */
    function setStatus(newStatus : string) {
        const params = new URLSearchParams(searchParams);

        if (newStatus === 'all') {
            params.delete('status');
        } else {
            params.set('status', newStatus);
        }

        router.push(`/whales?${params.toString()}`);
    }

    /*
     * pushes or deletes pods to the search parameter
     */
    function togglePod(pod : string) {
        const params = new URLSearchParams(searchParams);
        const currentPods = params.getAll('pod');

        if (pod === 'all') {
            params.delete('pod');
        } else if (currentPods.includes(pod)) {
            params.delete('pod');
            currentPods.filter(p => p !== pod).forEach(p => params.append('pod', p));
        } else if (!currentPods.includes(pod) && currentPods.length == 2) {
            params.delete('pod');
        } else {
            params.append('pod', pod);
        }

        router.push(`/whales?${params.toString()}`);
    }

    /*
     * helper function to parse active status and active pods
     * to api path.
     */
    function createApiPath() {
        const status = activeStatus === 'all' ? '' : '/' + activeStatus;

        const pods = activePods.length === 3 ? "" : activePods.length > 0 ? '/pod' + activePods.map(p => '/' + p).join('') : '';

        return `${status}${pods}`;
    }

    useEffect(() => {
        async function fetchData() {
            const path = createApiPath();

            const whalesRes = await fetch(`${API_BASE}/whales${path}`);
            setWhales(await whalesRes.json());

            const linksRes = await fetch(`${API_BASE}/network/edges${path}`);
            setLinks(await linksRes.json());

            setLoading(false);
        }

        fetchData();


    }, [activeStatus, activePods.join(',')]);

    if (loading) return;

    return (
        <div>
            <div>
                <div>Status</div>
                <ul>
                    <li onClick={() => setStatus("all")}>All</li>
                    <li onClick={() => setStatus("living")}>Living</li>
                    <li onClick={() => setStatus("deceased")}>Deceased</li>
                </ul>

                <div>Pod</div>
                <ul>
                    <li onClick={() => togglePod("all")}>All</li>
                    <li onClick={() => togglePod("j")}>J Pod</li>
                    <li onClick={() => togglePod("k")}>K Pod</li>
                    <li onClick={() => togglePod("l")}>L Pod</li>
                </ul>
            </div>

            <div>
                <h2>Whales</h2>
                <div className="network-container">
                   <NetworkGraph data={{ whales, links }} />
                </div>
            </div>
        </div>
    )
}
