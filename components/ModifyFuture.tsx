"use client";

import { useState } from "react";

export default function ModifyFuture() {
  const [policyId, setPolicyId] = useState("");

  const handleSubmit = () => {
    console.log("Policy ID:", policyId);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">
            Withdraw Coverage of Unbought/Expired Policies
          </div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        {/* <p className="text-lg font-semibold mb-12 mx-2 text-black">
          Withdraw Coverage of Unbought/Expired Policies
        </p> */}

        <div className="field-row-stacked pt-6">
          <label
            htmlFor="policyId"
            className="block text-sm font-medium text-xl mx-12 text-black"
          >
            Policy ID
          </label>
          <div className="mx-12">
            <input
              id="policyId"
              type="text"
              value={policyId}
              onChange={(e) => setPolicyId(e.target.value)}
              className="w-full border rounded-md mb-4 text-black"
              placeholder="Enter Your Policy ID"
            />
          </div>
        </div>
        <div className="flex place-content-between">
          <div></div>
          <button
            onClick={handleSubmit}
            className="w-16 text-black mt-4 cursor-pointer mr-12 mb-6"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
