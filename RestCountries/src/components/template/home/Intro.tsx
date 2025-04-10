import React from "react";
import Link from "next/link";
import { FlipWords } from "./FadeAnimation";

function Intro() {
  const countryFeatures = [
    "Name",
    "Capital",
    "Currency",
    "Flag"
  ];

  return (
    <>
      <div className="min-h-[36rem] w-full overflow-hidden dark:bg-black bg-white flex-col dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <h1
          data-aos="fade-up"
          className="text-3xl mx-auto text-left sm:text-center sm:text-5xl md:text-6xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-800 py-7 mt-20"
        >
          Explore
          <br className="sm:hidden" />
          <FlipWords words={countryFeatures} />
          <br />
          Data with our Country API
        </h1>

        <p className="text-lg sm:text-xl w-11/12 sm:w-9/12 md:w-7/12 sm:text-center">
          Want an API that delivers comprehensive, real-time country data? Delevelpper provides essential information — including each country&apos;s name, capital, currency, and flag — to power your innovative projects.
        </p>

        <Link href="/explorer">
          <button className="flex items-center justify-center mt-9 hover:scale-95 transition-all font-bold py-3 px-6 rounded-full bg-transparent text-black dark:text-white border border-black dark:border-white">
            Explore
            <svg
              className="w-4 h-4 ml-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </Link>
      </div>
    </>
  );
}

export default Intro;
