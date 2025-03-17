"use client";

import Button from "../_components/Button/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { pods, threats } from "./content";

export default function About() {
  const router = useRouter();

  function routeToGraph() {
    router.push("/whales");
  }

  return (
    <div>
      <div className="flex items-end h-[80vh] mb-40">
        <div className="">
          <h1 className="mx-auto w-[60%] pb-5 text-[110px]/30 text-center font-bold">
            A Family Like No Other
          </h1>
          <p className="mx-auto w-[50%] text-center">
            The Southern Resident Killer Whales (SRKW) are an extraordinary
            population of orcas that live in the Salish Sea and along the
            Pacific Northwest coast. Unlike transient (Bigg’s) killer whales
            that hunt marine mammals, Southern Residents are fish-eating orcas,
            relying almost entirely on Chinook salmon for survival.
          </p>
        </div>
      </div>

      <div className="mx-auto w-[85%] mb-20">
        <h2 className="text-sub font-bold">Meet the Pods</h2>
        <div className="flex">
          <div className="flex flex-col gap-40 w-[50%]">
            <PodCard pod={pods[0]} />
            <PodCard pod={pods[2]} />
          </div>
          <div className="flex flex-col justify-center w-[50%]">
            <PodCard pod={pods[1]} />
          </div>
        </div>
      </div>

      <div className="mx-auto w-[85%] mb-20">
        <h2 className="pb-10 text-sub font-bold">A Legacy at Risk</h2>
        <p className="w-[60%] mb-10">
          Once numbering over 140 individuals, the Southern Resident population
          has dropped to fewer than 75 whales. They were first recognized as an
          endangered population in 2005, and their decline has been driven by
          human-caused threats such as:
        </p>
        <div className="flex justify-between gap-5">
          {threats.map((threat, i) => (
            <ThreatCard threat={threat} index={i} key={i} />
          ))}
        </div>
        <p className="w-[60%] mt-10">
          Despite these challenges, conservation efforts are underway to restore
          their food supply, protect their waters, and ensure future generations
          can still witness these whales in the wild.
        </p>
      </div>

      <div className="flex mx-auto w-[85%]">
        <div className="flex flex-col w-[60%]">
          <h2 className="pb-10 text-sub/20 font-bold">
            How the Pods Stay Connected
          </h2>
          <p className="w-[95%] pb-5">
            Southern Residents aren’t just a random group of whales—they are a
            family network, with individuals staying in matrilineal groups their
            entire lives. Each pod is made up of smaller family units, usually
            centered around an elder female, who acts as the leader and
            knowledge keeper.
          </p>
          <p className="w-[95%]">
            At Resident Connections, we’ve built a unique interactive network
            graph that lets you explore these connections—showing which whales
            are related, which travel together, and how generations are linked.
          </p>
          <div className="w-35 pt-5">
            <Button label="Explore" onClick={routeToGraph} />
          </div>
        </div>
        <Image
          src="/images/graph-sc.png"
          height={1600}
          width={1600}
          quality={100}
          alt="Graph screen shot."
          className="w-[40%] object-contain"
        />
      </div>
    </div>
  );
}

interface PodCardProps {
  pod: {
    id: string;
    desc: string;
  };
}

function PodCard({ pod }: PodCardProps) {
  const router = useRouter();

  function handleClick() {
    router.push(`/whales?pod=${pod.id.toLowerCase()}`);
  }

  return (
    <div className="relative">
      <div className="text-[350px]/80 text-[#5B5B5B] italic font-bold">
        {pod.id}
      </div>
      <div className="absolute top-30 left-15 w-[90%]">
        <p>{pod.desc}</p>
        <div className="w-35 pt-4 ml-50">
          <Button label="Explore" onClick={handleClick} />
        </div>
      </div>
    </div>
  );
}

interface ThreatCardProps {
  threat: {
    label: string;
    desc: string;
  };
  index: number;
}

function ThreatCard({ threat, index }: ThreatCardProps) {
  return (
    <div className="flex flex-col gap-5 w-[33%]">
      <div className="text-[18px] font-bold">
        <span className="font-normal">0{index + 1} </span>
        {threat.label}
      </div>
      <p>{threat.desc}</p>
    </div>
  );
}
