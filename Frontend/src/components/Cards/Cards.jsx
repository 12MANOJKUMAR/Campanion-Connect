import React from "react";

const Cards = () => {
  return (
    <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden w-60 cursor-pointer hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="bg-[#2A2A2A] flex justify-center items-center p-2">
        <img
          src="https://m.media-amazon.com/images/I/71LAvzkdxRL._AC_UF1000,1000_QL80_.jpg"
          alt="Kafan"
          className="rounded-md h-60 object-cover"
        />
      </div>

      {/* Book details */}
      <div className="p-3 text-gray-200">
        <h2 className="text-lg font-semibold">Kafan</h2>
        <p className="text-sm text-gray-400 mb-1">by Prem Chand</p>
        <p className="text-base font-medium">₹ 141</p>
      </div>
    </div>
  );
};

export default Cards
