import React from "react";
import { Link } from "react-router-dom";
import LineWaves from "../components/LineWaves";
import { Button } from "../components/ui/Button";
import DecryptedText from "../components/DecryptedText";
import FuzzyText from "../components/FuzzyText";

export const NotFound = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-100px)] w-full text-center overflow-hidden">
      {/* Interactive LineWaves Background */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
        <LineWaves
          speed={0.3}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1.5}
          rotation={-45}
          edgeFadeWidth={0.2}
          colorCycleSpeed={1.0}
          brightness={0.4}
          color1="#000000ff" // red
          color2="#999999ff" // orange
          color3="#484748ff" // yellow
          enableMouseInteraction={true}
          mouseInfluence={6.5}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 flex-1">
        {/* <div className=" flex flex-col items-center justify-center glass-panel backdrop-blur-xl bg-black/40 border border-red-500/20 p-10 md:p-16 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] w-full"> */}
        <h1 className="text-7xl md:text-9xl font-black text-red-500 mb-6 tracking-tighter drop-shadow-lg text-center">

          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover
          >
            404
          </FuzzyText>

        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 text-center">
          <DecryptedText
            text="System Anomalies Detected"
            animateOn="hover"
            revealDirection="center"
            speed={60}
          />
        </h2>
        <p className="text-lg md:text-xl text-slate-300 max-w-lg mx-auto mb-10 text-center leading-relaxed">
          The sector you are attempting to navigate to does not exist or has been permanently erased.
        </p>

        <div className="flex justify-center">
          <Link to="/" className="no-underline w-full sm:w-auto">
            <Button variant="primary" className="bg-red-600 hover:bg-red-700 hover:shadow-red-500/50 text-lg px-8 py-4 w-full">
              Return to Home Base
            </Button>
          </Link>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};
