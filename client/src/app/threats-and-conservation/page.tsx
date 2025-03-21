import { threats } from "./content";

export default function ThreatsAndConservation() {
  return (
    <div>
      <div className="flex flex-col justify-end mb-30 mx-auto w-[90%] lg:w-[85%] h-[82vh]">
        <h1 className="mb-5 text-[50px]/15 lg:text-[110px]/30 font-bold">
          Threats & Conservation
        </h1>
        <div className="mb-5 text-white text-[18px] font-bold">
          The Fight to Save the Southern Resident Killer Whales
        </div>
        <div className="flex flex-col gap-5 lg:w-[65%]">
          <p>
            The Southern Resident Killer Whales are one of the most endangered
            marine mammal populations in the world. With fewer than 75
            individuals remaining, their survival is at a critical turning
            point.
          </p>
          <p>
            For decades, these whales have thrived in the Salish Sea, hunting
            salmon, raising their young, and navigating the same waters as their
            ancestors. But today, human impact is pushing them to the brink.
          </p>
          <p>
            What’s threatening their future? And more importantly, what can we
            do to help?
          </p>
        </div>
      </div>

      <div className="mb-20 mx-auto w-[90%] lg:w-[85%]">
        <h2 className="mb-10 lg:mb-20 text-[35px]/10 lg:text-sub/20 font-bold">
          The Biggest Threats to Southern Resident Killer Whales
        </h2>
        <div className="flex flex-col gap-20">
          {threats.map((threat, index) => (
            <ThreatSection threat={threat} index={index} key={index} />
          ))}
        </div>
      </div>

      <div className="mx-auto w-[90%] lg:w-[85%]">
        <h3 className="mb-5 lg:mb-10 text-[35px]/10 lg:text-sub/20 font-bold">
          Hope for the Future
        </h3>
        <div className="lg:w-[60%]">
          <p className="mb-5">
            {`Despite these challenges, there is still hope. With ongoing
          conservation efforts, legal protections, and public support, we can
          help restore the Southern Resident Killer Whales' ecosystem and ensure
          their survival for future generations.`}
          </p>
          <p>
            Every action counts. Every voice matters. Together, we can turn the
            tide for these incredible whales.
          </p>
        </div>
      </div>
    </div>
  );
}

interface ThreatSectionProps {
  threat: {
    label: string;
    problem: string;
    impact: string;
    solution: string;
  };
  index: number;
}

function ThreatSection({ threat, index }: ThreatSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-[50%]">
        <div className="mb-5 text-[100px]/20 lg:text-[130px]/30 text-gray italic">
          0{index + 1}
        </div>
        <div className="mb-5 lg:mb-0 lg:w-[70%] text-[24px] lg:text-[30px] font-bold">
          {threat.label}
        </div>
      </div>
      <div className="flex flex-col gap-5 lg:w-[50%]">
        <div className="text-[18px] font-bold">The Problem</div>
        <p className="mb-2">{threat.problem}</p>
        <div className="text-[18px] font-bold">The Impact</div>
        <p className="mb-2">{threat.impact}</p>
        <div className="text-[18px] font-bold">{`What's Being Done?`}</div>
        <p>{threat.solution}</p>
      </div>
    </div>
  );
}
