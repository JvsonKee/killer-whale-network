import WhaleLink from "@/app/_components/WhaleLink/WhaleLink";
import type { Pod } from "@/app/types/pod";
import type { Whale } from "@/app/types/whale";

async function getPod(pod_id : string) {
    const URL_BASE = process.env.API_URL_BASE;

    const res = await fetch(`${URL_BASE}/whales/pod/${pod_id}`, { cache: 'no-store'});
    return await res.json();
}

export default async function Pod({
    params
} : {
    params: Promise<{pod_id: string}>
}) {
    const pod_id = (await params).pod_id;
    const data: Whale[] = await getPod(pod_id);

    return (
        <div>
            <h1>{pod_id} Pod</h1>
            <ul>
                {
                    data.map((whale, i) => (
                        <li key={i}>
                            <WhaleLink whale={whale} />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}