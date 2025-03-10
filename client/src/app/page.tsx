'use client';

import Button from "./_components/Button/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
    const router = useRouter();

    const discoverInfo = [
        {
            header: 'Meet the Whales',
            body: 'Get to know individual orcas by name. Explore their family histories, photos, birth years, and the special roles they play in their pods.',
            path: '/whales'
        },
        {
            header: 'The Pod Network',
            body: 'Visualize the deep social bonds between whales. Our interactive graph lets you explore how whales are connected—by bloodlines, pods, and shared history.',
            path: '/whales'
        },
        {
            header: 'Threats & Conservation',
            body: 'Learn what challenges these whales face and the ongoing work happening to protect them. Find out how you can be part of the solution.',
            path: '/tc'
    }
    ];

    function handleButton() {
        router.push('/whales');
    }

    return (
        <div className="w-full mx-auto">
            <Image
                src='/images/orca-eye-left.svg'
                width={100}
                height={100}
                alt="Left orca eye"
                className="absolute -top-12 -left-5 w-60"
            />

            <Image
                src='/images/orca-eye-right.svg'
                width={100}
                height={100}
                alt="Left orca right"
                className="absolute -top-20 -right-13 w-75"
            />
            <div className="flex flex-col justify-end mx-auto mb-40 w-[68%] h-[80vh]">
                <h1 className="mb-10 text-[110px]/30 font-bold">Resident Connections</h1>
                <div className="w-[67%]">
                    <p className="text-body">
                        Discover the incredible world of the Southern Resident Killer Whales—a unique, endangered population of orcas living in the waters of the Pacific Northwest. These whales aren’t just individuals; they’re part of a tightly connected family, with relationships spanning generations.
                    </p>
                    <p className="my-5 text-body">
                        Resident Connections brings those connections to life.
                    </p>
                    <p className="mb-7 text-body">
                        Explore our interactive whale network graph to see how each whale is linked—by family, pod, and history.
                    </p>
                    <div className="w-35">
                        <Button label="Explore" onClick={handleButton}/>
                    </div>
                </div>
            </div>
            <div className="mb-50 mx-auto w-[75%] h-[50vh]">
                <h2 className="mx-auto mb-10 w-[70%] text-sub/23 font-bold text-center">Why the Southern Residents Matter?</h2>
                <div className="flex items-center justify-center gap-[5%]">
                    <div className="w-[50%]">
                        <Image
                            src='/images/j32_spray.jpg'
                            alt='J Pod breach.'
                            width={3592}
                            height={2395}
                            className="w-[100%] h-[280px] object-cover mb-2 rounded-xs"
                        />
                        <div className="text-[10px] float-right">
                            (Photo: <a href="https://www.flickr.com/photos/mrmritter/6074033708/" target="_blank" className="hover:text-blue duration-300">Miles Ritter</a> | CC BY-NC-ND 2.0)
                        </div>
                    </div>
                    <div className="w-[45%]">
                        <p className="mb-5 text-body">
                            The Southern Residents aren't just a group of whales—they’re a family. Organized into three pods—J-Pod, K-Pod, and L-Pod—these orcas have unique cultures, dialects, and social structures passed down through generations.
                        </p>
                        <p className="text-body">
                            They rely on one another for survival, and they rely on us to protect the environment they call home. With threats like declining salmon populations, ocean noise, and pollution pushing them to the brink, understanding their world has never been more urgent.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mx-auto w-[85%] h-[60vh]">
                <h2 className="mb-10 text-sub/23 font-bold">What You'll Discover Here</h2>
                <p className="mb-10 w-[50%] text-body">
                    Whether you're a longtime orca enthusiast, a student, or just curious, Resident Connections is your hub for exploring the Southern Residents.
                </p>
                <div className="flex gap-7">
                    {
                        discoverInfo.map((info, i) => (
                            <DiscoverCard info={info} key={i}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

interface DiscoverInfoProps {
    info: {
      header: string,
      body: string,
      path: string
    }
}

function DiscoverCard({ info } : DiscoverInfoProps) {
    const router = useRouter();

    function handleButton() {
        router.push(info.path)
    }

    return (
        <div className="w-[33%]">
            <h3 className="mb-5 text-[18px] font-bold">{info.header}</h3>
            <p className="mb-7 text-body">{info.body}</p>
            <div className="w-35">
              <Button label={'Explore'} onClick={handleButton}/>
            </div>
        </div>
    )
}
