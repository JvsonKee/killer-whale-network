import Link from "next/link";

const links = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "About",
    path: "/about",
  },
  {
    label: "Whales",
    path: "/whales",
  },
  {
    label: "Threats & Conservation",
    path: "/threats-and-conservation",
  },
];

export default function Footer() {
  return (
    <div className="flex items-center justify-center mt-20 w-full h-[45vh] bg-white">
      <div className="flex gap-30 w-[85%]">
        <div className="w-[60%] text-[110px]/30 text-black font-bold">
          Resident Connections
        </div>
        <div className="flex flex-col justify-end gap-5 pb-3">
          {links.map((link) => (
            <Link
              href={link.path}
              key={link.label}
              className="text-black hover:text-blue duration-300 ease-in-out`
"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
