import NetworkGraph from "../_components/NetworkGraph/NetworkGraph";
import { Link } from "@/app/types/link";
import { Whale } from "@/app/types/whale";
import GraphFilter from "../_components/GraphFilter/GraphFilter";

interface WhalesProps {
  searchParams: Promise<{
    status: string;
    pod: Array<string>;
    colour: string;
  }>;
}

async function getData(path: string) {
  const API_BASE = process.env.API_URL;

  const whalesRes = await fetch(`${API_BASE}/whales${path}`);
  const linksRes = await fetch(`${API_BASE}/network/edges${path}`);

  if (!whalesRes.ok || !linksRes.ok) {
    return { whales: [], links: [] };
  }

  const whales: Whale[] = await whalesRes.json();
  const links: Link[] = await linksRes.json();

  return { whales, links };
}

export default async function Whales({ searchParams }: WhalesProps) {
  const sp = await searchParams;

  const status = sp.status || "all";
  const pods = !sp.pod ? [] : sp.pod.length === 1 ? [sp.pod] : sp.pod;
  const activeColour = sp.colour || "gender";

  /*
   * helper function to parse active status and active pods
   * to api path.
   */
  function createApiPath() {
    const activeStatus = status === "all" ? "" : "/" + status;

    const activePods =
      pods.length === 3
        ? ""
        : pods.length > 0
          ? "/pod" + pods.map((p) => "/" + p).join("")
          : "";

    return `${activeStatus}${activePods}`;
  }

  const { whales, links } = await getData(createApiPath());

  if (!whales.length || !links.length)
    return (
      <div className="flex items-center justify-center h-[85vh]">
        Error fetching data...
      </div>
    );

  return (
    <div className="w-full">
      <h1 className="mb-5 lg:mb-0 mx-auto w-[90%] lg:w-[85%] text-[35px]/10 lg:text-sub/23 font-bold">
        Meet the Residents
      </h1>

      <GraphFilter />
      <NetworkGraph data={{ whales, links, activeColour }} />
    </div>
  );
}
