import { ExternalLink } from "lucide-react";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <div
      onClick={onClick}
      className="group w-full h-8 rounded-full bg-[#252525] text-[14px]/8 cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#1C1C1C]"
    >
      {label}
      <ExternalLink className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[1px] group-hover:-translate-y-[2px]" />
    </div>
  );
}
