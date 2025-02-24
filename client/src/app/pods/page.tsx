import type { Pod } from "@/app/types/pod";
import Link from "next/link";

async function getPods(): Promise<Pod[]> {
    const URL_BASE = process.env.API_URL_BASE;
    
    const res = await fetch(`${URL_BASE}/pods`, { cache: 'no-store'});  
    return await res.json();
}

export default async function Pods() {
    const data: Pod[] = await getPods();

    return (
        <div>
            <h1>Pods</h1>
            <ul>
                {
                    data.map((pod, i) => (
                        <li key={i}>
                            <Link href={`/pods/${pod.pod_id}`}>
                                {pod.pod_id} Pod
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}