import Link from "next/link";

export default function NavBar() {
    return (
        <div>
            <Link href="/">Home</Link>
            <Link href="/whales">Whales</Link>
            <Link href="/pods">Pods</Link>
        </div>
    )
}