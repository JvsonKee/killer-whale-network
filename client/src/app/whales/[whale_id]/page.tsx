import FamilyTree from "@/app/_components/FamilyTree/FamilyTree";
import type { Whale } from "@/app/types/whale";

async function getWhale(whale_id: string) {
    const URL_BASE = process.env.API_URL_BASE;

    const res = await fetch(`${URL_BASE}/whales/${whale_id}`, {
      cache: "no-store",
    });
    return await res.json();
}

async function getFamily(whale_id : string) {
    const API_BASE = process.env.API_URL_BASE;

    const res = await fetch(`${API_BASE}/whales/family/${whale_id}`, {
        cache: "no-store"
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
    const familyData = await getFamily(whale_id);

    return (
      <div className="mx-auto w-[85%]">
          <h1 className="text-sub font-bold">{whale.name} ({whale.whale_id})</h1>
          <div>
              <FamilyTree familyData={familyData}/>
          </div>
      </div>
    );
}
