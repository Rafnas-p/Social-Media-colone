import Link from 'next/link';
import React from 'react';

function Channalnav() {
  return (
    <div className=" text-black  mt-20 ml-20">
        <h1 className="text-lg font-bold p-8">Channel Content</h1>

        <div className="flex space-x-8  ">
          <Link href={'/channal'}>
         Videos
          </Link>
          <Link href={'/channal/shortsbord'}>
            Shorts
          </Link>
          
        </div>
      <hr className="border-gray-300" />
    </div>
  );
}

export default Channalnav;
