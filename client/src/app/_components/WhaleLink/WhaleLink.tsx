import type { Whale } from "@/app/types/whale";
import Link from "next/link";

export default function WhaleLink({whale} : {whale : Whale}) {
    return (
        <Link href={`/whales/${whale.whale_id}`}>
            {whale.whale_id} &quot;{whale.name}&quot;
        </Link>
    )
}