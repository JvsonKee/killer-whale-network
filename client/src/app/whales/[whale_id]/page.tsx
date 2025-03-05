import type { Whale } from "@/app/types/whale";

async function getWhale(whale_id: string) {
    const URL_BASE = process.env.API_URL_BASE;

    const res = await fetch(`${URL_BASE}/whales/${whale_id}`, {
      cache: "no-store",
    });
    return await res.json();
}

export default async function Whale({
  params,
}: {
  params: Promise<{ whale_id: string }>;
}) {
    const whale_id = (await params).whale_id;
    const whale: Whale = await getWhale(whale_id);

    return (
      <div>
        <h1>{whale.whale_id}</h1>
      </div>
    );
}
