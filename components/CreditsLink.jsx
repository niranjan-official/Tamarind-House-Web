"use client";
import Link from "next/link";
import React from "react";

const CreditsLink = () => {
  return (
    <div className="pb-2 text-center">
      <Link href={"/credits"} className="text-primary underline">
        Credits
      </Link>
    </div>
  );
};

export default CreditsLink;
