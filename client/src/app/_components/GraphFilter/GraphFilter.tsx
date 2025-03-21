"use client";

import { useRouter, useSearchParams } from "next/navigation";

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

export default function GraphFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeStatus = searchParams.get("status") || "all";
  const activePods = searchParams.getAll("pod");
  const activeColour = searchParams.get("colour") || "gender";

  function toggleStatus(newStatus: string) {
    const params = new URLSearchParams(searchParams);

    if (newStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", newStatus);
    }

    router.push(`/whales?${params.toString()}`, { scroll: false });
  }

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

  return (
    <div className="flex flex-col lg:flex-row gap-5 lg:gap-20 w-[90%] lg:w-[85%] mx-auto">
      {filterData.map((filter) => (
        <Filter
          filter={filter}
          activeFilters={
            filter.label === "Status"
              ? [activeStatus]
              : filter.label === "Pod"
                ? activePods
                : [activeColour]
          }
          onUpdateActive={
            filter.label === "Status"
              ? toggleStatus
              : filter.label === "Pod"
                ? togglePod
                : toggleColour
          }
          key={filter.label}
        />
      ))}
    </div>
  );
}

interface FilterProps {
  filter: {
    label: string;
    filters: Array<string>;
  };

  activeFilters: Array<string>;

  onUpdateActive: (arg0: string) => void;
}

function Filter({ filter, activeFilters, onUpdateActive }: FilterProps) {
  function isActive(currentFilter: string) {
    if (
      filter.label === "Pod" &&
      currentFilter === "All" &&
      activeFilters.length === 0
    ) {
      return true;
    }

    return activeFilters.includes(currentFilter.toLowerCase());
  }
  return (
    <div>
      <div className="mb-2 text-sm text-stone-300">{filter.label}</div>
      <div className="flex gap-3 font-bold">
        {filter.filters.map((f: string) => (
          <div
            onClick={() => onUpdateActive(f.toLowerCase())}
            key={f}
            className={`cursor-pointer hover:border-b-1 ${isActive(f) ? "border-b-1" : ""}`}
          >
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}
