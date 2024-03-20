import Image from "next/image";
import React from "react";

const team = [
  "Christy John Biju",
  "Deepu Sasi",
  "Uk Ullas",
  "Vineeth KV",
  "Niranjan Sabarinath",
];
const page = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col p-4 bg-secondary">
        <h1 className="text-center text-3xl">Credits</h1>
        <p className="text-justify mt-4">
          Special thanks to our principal,{" "}
          <span className="font-semibold">Dr. Santhosh Simon</span>, our
          classmates from the <span className="font-semibold">CSE 2022</span>{" "}
          batch, and all the faculties in the CSE department for their support.
          A heartfelt acknowledgment to the HOD of Computer Science,{" "}
          <span className="font-semibold">Dr. Bibin Vincent</span>, for his
          exceptional contributions, and gratitude to our IT admin,{" "}
          <span className="font-semibold">Renjiv Rajan</span>, for their
          invaluable assistance.
        </p>
        <h1 className="my-4 text-2xl">Development Team</h1>
        <div className="w-full flex flex-col gap-4">
          {team.map((name, index) => (
            <div key={index}>
              <div className="flex items-center p-2 gap-4">
                <div className="h-14 w-14 rounded-full overflow-hidden p-1 bg-white">
                  <Image
                    src={`/images/team/${index + 1}.jpg`}
                    height={70}
                    width={70}
                    className="rounded-full"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xl">{name}</span>
                  <span className="text-sm text-gray-500">CSE 2022</span>
                </div>
              </div>
              <hr className="border border-gray-300" />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-20 flex justify-center items-center text-center bg-slate-200 p-4">
        <p>
          &#169;{" "}
          <span className="text-sm text-grey-500">
            Providence College of Engineering and School of Business
          </span>
        </p>
      </div>
    </>
  );
};

export default page;
