"use client"

import React from 'react'
import Snippets from '../codeSnippets/Snippets'
import Link from 'next/link';
function ExampleCode() {


  const codeToShow = `
"use client";

const response = await fetch(
  process.env.NEXT_PUBLIC_BACKEND_URL + '/countries?name=(country name, e.g., Canada)',
  {
    headers: {
      "X-API-KEY": "YOUR_API_KEY"
    }
  }
);
const data = await response.json();
console.log(data);
`;

  return (
    <div className="min-w-full py-4">
      <h1 className="text-xl md:text-3xl font-bold mt-4">Example Code</h1>
      <Snippets text="Get Country Data" code={codeToShow} />

      <Link href={'/explorer'}>
        <button
          className="my-9 hover:scale-95 transition-all font-bold py-3 px-6 rounded-full bg-gradient-to-br from-purple-700 to-blue-900 shadow-lg shadow-indigo-500/50 text-white"
        >
          Try it
        </button>

      </Link>

    </div>
  )
}

export default ExampleCode
