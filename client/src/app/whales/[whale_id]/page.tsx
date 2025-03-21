import FamilyTree from "@/app/_components/FamilyTree/FamilyTree";
import type { Whale } from "@/app/types/whale";
import Link from "next/link";

interface WhaleProps {
  params: Promise<{
    whale_id: string;
  }>;
}

async function getWhale(whale_id: string) {
  const URL_BASE = process.env.API_URL;

  const res = await fetch(`${URL_BASE}/whales/${whale_id}`);

  if (!res.ok) {
    return;
  }

  return await res.json();
}

async function getFamily(whale_id: string) {
  const API_BASE = process.env.API_URL;

  const res = await fetch(`${API_BASE}/whales/family/${whale_id}`);

  if (!res.ok) {
    return;
  }

  return await res.json();
}

export default async function Whale({ params }: WhaleProps) {
  const { whale_id } = await params;
  const whale: Whale = await getWhale(whale_id);
  const familyData = await getFamily(whale_id);

  const currentYear = new Date().getFullYear();

  const cellHeaderStyle = "mb-1 text-sm text-stone-300";
  const cellDataStyle = "font-bold";

  if (!whale || !familyData)
    return (
      <div className="flex items-center justify-center w-full h-[85vh]">
        Error fetching data...
      </div>
    );

  return (
    <div className="w-full">
      <div className="mx-auto w-[90%] lg:w-[85%]">
        <h1 className="mb-5 lg:mb-10 text-[50px]/15 lg:text-sub font-bold">
          {whale.name} ({whale.whale_id})
        </h1>
        <div className="mb-5 lg:mb-0">
          <div className="flex justify-between lg:justify-start lg:gap-10">
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
                <Link
                  href={`/whales/${whale.mother_id}`}
                  className={cellDataStyle + " hover:border-b-1"}
                >
                  {whale.mother_id}
                </Link>
              </div>
            ) : null}
            {whale.father_id ? (
              <div>
                <h2 className={cellHeaderStyle}>Father</h2>
                <Link
                  href={`/whales/${whale.father_id}`}
                  className={cellDataStyle + " hover:border-b-1"}
                >
                  {whale.father_id}
                </Link>
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
