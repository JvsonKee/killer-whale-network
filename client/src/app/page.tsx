"use client";

import Button from "./_components/Button/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { discoverInfo } from "./content";

export default function Home() {
  const router = useRouter();

  function handleButton() {
    router.push("/whales");
  }

  return (
    <div className="w-full mx-auto">
      <Image
        src="/images/orca-eye-left.svg"
        width={100}
        height={100}
        alt="Left orca eye"
        className="absolute top-16 sm:-top-12 left-0 sm:-left-5 w-21 sm:w-60"
      />

      <Image
        src="/images/orca-eye-right.svg"
        width={100}
        height={100}
        alt="Left orca right"
        className="absolute top-16 sm:-top-20 -right-2 sm:-right-13 sm:w-75"
      />
      <div className="flex flex-col justify-end mx-auto mb-30 w-[90%] lg:w-[65%] h-[87vh] lg:h-[83vh]">
        <h1 className="mb-5 lg:mb-10 text-[50px]/15 lg:text-[110px]/30 font-bold">
          Resident Connections
        </h1>
        <div className="w-full lg:w-[67%]">
          <p>
            Discover the incredible world of the Southern Resident Killer
            Whales. A unique, endangered population of killer whales living in
            the waters of the Pacific Northwest. These whales aren’t just
            individuals, they’re part of a tightly connected family, with
            relationships spanning generations.
          </p>
          <p className="my-5">
            <i>Resident Connections</i> brings those connections to life.
          </p>
          <p className="mb-7">
            Explore the interactive whale network graph to see how each whale is
            linked, by family, pod, and history.
          </p>
          <div className="w-35">
            <Button label="Explore" onClick={handleButton} />
          </div>
        </div>
      </div>
      <div className="mb-20 mx-auto w-[90%] lg:w-[75%]">
        <h2 className="mx-auto mb-10 w-full lg:w-[70%] text-[35px]/10 lg:text-sub/23 font-bold lg:text-center">
          Why the Southern Residents Matter?
        </h2>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-[5%]">
          <div className="mb-5 lg:mb-0 w-full lg:w-[50%]">
            <Image
              src="/images/j32_spray.jpg"
              alt="J-32 spray."
              width={3592}
              height={2395}
              className="w-[100%] h-[280px] object-cover mb-2 rounded-sm"
            />
            <div className="text-[10px] float-right">
              (Photo:{" "}
              <a
                href="https://www.flickr.com/photos/mrmritter/6074033708/"
                target="_blank"
                className="hover:text-blue duration-300"
              >
                Miles Ritter
              </a>{" "}
              | CC BY-NC-ND 2.0)
            </div>
          </div>
          <div className="w-full lg:w-[45%]">
            <p className="mb-5">
              {`The Southern Residents aren't just a group of whales, they’re a
              family. Organized into three pods, J-Pod, K-Pod, and L-Pod, these
              killer whales have unique cultures, dialects, and social structures passed
              down through generations.`}
            </p>
            <p>
              They rely on one another for survival, and they rely on us to
              protect the environment they call home. With threats like
              declining salmon populations, ocean noise, and pollution pushing
              them to the brink, understanding their world has never been more
              urgent.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto w-[90%] lg:w-[85%]">
        <h2 className="mb-5 text-[35px]/10 lg:text-sub/23 font-bold">
          {`What You'll Discover Here`}
        </h2>
        <p className="mb-10 w-full lg:w-[50%]">
          {`Whether you're a longtime killer whale enthusiast, a student, or just curious,
          Resident Connections is your hub for exploring the Southern Residents.`}
        </p>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-7">
          {discoverInfo.map((info, i) => (
            <DiscoverCard info={info} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface DiscoverInfoProps {
  info: {
    header: string;
    body: string;
    path: string;
  };
}

function DiscoverCard({ info }: DiscoverInfoProps) {
  const router = useRouter();

  function handleButton() {
    router.push(info.path);
  }

  return (
    <div className="w-full lg:w-[33%] rounded-md">
      <h3 className="mb-5 text-[18px] font-bold">{info.header}</h3>
      <div className="flex flex-col justify-between gap-4 lg:gap-2 h-[80%]">
        <p className="text-body">{info.body}</p>
        <div className="w-35">
          <Button label={"Explore"} onClick={handleButton} />
        </div>
      </div>
    </div>
  );
}
