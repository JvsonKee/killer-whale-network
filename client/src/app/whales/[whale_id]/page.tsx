import FamilyTree from "@/app/_components/FamilyTree/FamilyTree";
import type { Whale } from "@/app/types/whale";

async function getWhale(whale_id: string) {
    const URL_BASE = process.env.API_URL_BASE;

    const res = await fetch(`${URL_BASE}/whales/${whale_id}`, {
        cache: "no-store",
    });
    return await res.json();
}

async function getFamily(whale_id: string) {
    const API_BASE = process.env.API_URL_BASE;

    const res = await fetch(`${API_BASE}/whales/family/${whale_id}`, {
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
    const familyData = await getFamily(whale_id);

    const currentYear = new Date().getFullYear();

    const cellHeaderStyle = "mb-1 text-sm text-stone-300";
    const cellDataStyle = "font-bold";
    return (
        <div className="w-full">
            <div className="mx-auto w-[85%]">
                <h1 className="mb-5 text-sub font-bold">
                    {whale.name} ({whale.whale_id})
                </h1>
                <div>
                    <div className="flex gap-10">
                        <div>
                            <h2 className={cellHeaderStyle}>Birth Year</h2>
                            <div className={cellDataStyle}>{whale.birth_year}</div>
                        </div>
                        <div>
                            <h2 className={cellHeaderStyle}>
                                {whale.death_year === null ? "Age" : "Death Year"}
                            </h2>
                            <div className={cellDataStyle}>
                                {whale.death_year === null
                                    ? `${currentYear - whale.birth_year}`
                                    : `${whale.death_year}`}
                            </div>
                        </div>
                        <div>
                            <h2 className={cellHeaderStyle}>Gender</h2>
                            <div className={cellDataStyle}>
                                {whale.gender.charAt(0).toUpperCase() + whale.gender.slice(1)}
                            </div>
                        </div>
                        {whale.mother_id ? (
                            <div>
                                <h2 className={cellHeaderStyle}>Mother</h2>
                                <div className={cellDataStyle}>{whale.mother_id}</div>
                            </div>
                        ) : null}
                        {whale.father_id ? (
                            <div>
                                <h2 className={cellHeaderStyle}>Father</h2>
                                <div className={cellDataStyle}>{whale.father_id}</div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <FamilyTree familyData={familyData} currentWhale={whale_id} />
            </div>
        </div>
    );
}
