"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
  const pages = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Whales",
      path: "/whales",
    },
    {
      name: "Threats & Conservation",
      path: "/threats-and-conservation",
    },
  ];

  return (
    <div className="flex items-center justify-center gap-4 lg:gap-20 h-[10vh]">
      {pages.map((page) => (
        <NavLink page={page} key={page.name} />
      ))}
    </div>
  );
}

interface NavLinkProps {
  page: {
    name: string;
    path: string;
  };
}

function NavLink({ page }: NavLinkProps) {
  const pathName = usePathname();
  const isActive = pathName === page.path;

  return (
    <Link
      href={`${page.path}`}
      className={`${isActive ? "text-blue" : "text-white"} hover:text-blue duration-300 ease-in-out`}
    >
      {page.name}
    </Link>
  );
}
