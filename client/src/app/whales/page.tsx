"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NetworkGraph from "../_components/NetworkGraph/NetworkGraph";
import { Link } from "@/app/types/link";
import { Whale } from "@/app/types/whale";
import GraphFilter from "../_components/GraphFilter/GraphFilter";

const filterData = [
  {
    label: "Status",
    filters: ["All", "Living", "Deceased"],
  },
  {
    label: "Pod",
    filters: ["All", "J", "K", "L"],
  },
  {
    label: "Colour By",
    filters: ["Gender", "Pod"],
  },
];

export default function Whales() {
  const [whales, setWhales] = useState<Whale[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://127.0.0.1:5001";

  const router = useRouter();
  const searchParams = useSearchParams();

  const activeStatus = searchParams.get("status") || "all";
  const activePods = searchParams.getAll("pod");
  const activeColour = searchParams.get("colour") || "gender";

  /*
   * updates the active status search parameter.
   */
  function toggleStatus(newStatus: string) {
    const params = new URLSearchParams(searchParams);

    if (newStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", newStatus);
    }

    router.push(`/whales?${params.toString()}`, { scroll: false });
  }

  /*
   * pushes or deletes pods to the search parameter
   */
  function togglePod(pod: string) {
    const params = new URLSearchParams(searchParams);
    const currentPods = params.getAll("pod");

    if (pod === "all") {
      params.delete("pod");
    } else if (currentPods.includes(pod)) {
      params.delete("pod");
      currentPods
        .filter((p) => p !== pod)
        .forEach((p) => params.append("pod", p));
    } else if (!currentPods.includes(pod) && currentPods.length == 2) {
      params.delete("pod");
    } else {
      params.append("pod", pod);
    }

    router.push(`/whales?${params.toString()}`, { scroll: false });
  }

  function toggleColour(colour: string) {
    const params = new URLSearchParams(searchParams);

    params.set("colour", colour);

    router.push(`/whales?${params.toString()}`, { scroll: false });
  }

  /*
   * helper function to parse active status and active pods
   * to api path.
   */
  function createApiPath() {
    const status = activeStatus === "all" ? "" : "/" + activeStatus;

    const pods =
      activePods.length === 3
        ? ""
        : activePods.length > 0
          ? "/pod" + activePods.map((p) => "/" + p).join("")
          : "";

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
  }, [activeStatus, activePods.join(",")]);

  if (loading) return <div className="w-full h-[100vh]"></div>;

  return (
    <div className="w-full">
      <h1 className="w-[85%] mx-auto text-sub/23 font-bold">
        Meet the Residents
      </h1>
      <div className="flex gap-20 w-[85%] mx-auto">
        {filterData.map((data) => (
          <GraphFilter
            filterData={data}
            activeFilters={
              data.label === "Status"
                ? [activeStatus]
                : data.label === "Pod"
                  ? activePods
                  : [activeColour]
            }
            onUpdateActive={
              data.label === "Status"
                ? toggleStatus
                : data.label === "Pod"
                  ? togglePod
                  : toggleColour
            }
            key={data.label}
          />
        ))}
      </div>

      <div className="flex align-center justify-center w-full">
        <NetworkGraph data={{ whales, links, activeColour }} />
      </div>
    </div>
  );
}
