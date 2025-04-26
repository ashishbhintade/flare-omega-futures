"use client";

import { useState } from "react";

export default function CreateFuture() {
  const [formData, setFormData] = useState({
    indicator: "",
    trigger: "",
    increase: "",
    coverage: "",
    premium: "",
    numberOfPolicies: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      {/* <h1 className="text-2xl font-semibold">Enter Policy Information</h1> */}
      <div className="window space-y-4">
        <div className="title-bar">
          <div className="title-bar-text">Enter Policy Information</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>

        <div className="field-row-stacked mx-6">
          <label
            htmlFor="indicator"
            className="block text-sm font-medium text-xl text-black"
          >
            Indicator
          </label>
          <select
            id="indicator"
            name="indicator"
            value={formData.indicator}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-black"
          >
            <option value="">Select Indicator</option>
            <option value="Indicator A">Indicator A</option>
            <option value="Indicator B">Indicator B</option>
          </select>
        </div>

        <div className="field-row-stacked mx-6">
          <label
            htmlFor="trigger"
            className="block text-sm font-medium text-xl text-black"
          >
            Trigger
          </label>
          <select
            id="trigger"
            name="trigger"
            value={formData.trigger}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-black"
          >
            <option value="">Select Trigger</option>
            <option value="Trigger X">Trigger X</option>
            <option value="Trigger Y">Trigger Y</option>
          </select>
        </div>

        <div className="field-row-stacked mx-6">
          <label
            htmlFor="increase"
            className="block text-sm font-medium text-xl text-black"
          >
            Increase
          </label>
          <select
            id="increase"
            name="increase"
            value={formData.increase}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-black"
          >
            <option value="">Select Increase</option>
            <option value="Low">Low</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="field-row-stacked mx-6">
          <label
            htmlFor="coverage"
            className="block text-sm font-medium text-xl text-black"
          >
            Coverage
          </label>
          <input
            id="coverage"
            name="coverage"
            type="number"
            value={formData.coverage}
            onChange={handleChange}
            className="w-full border p-1 bg-white text-black"
            placeholder="Enter Coverage Amount"
          />
        </div>

        <div className="field-row-stacked mx-6">
          <label
            htmlFor="premium"
            className="block text-sm font-medium text-xl text-black"
          >
            Premium
          </label>
          <input
            id="premium"
            name="premium"
            type="number"
            value={formData.premium}
            onChange={handleChange}
            className="w-full border p-1 bg-white text-black"
            placeholder="Enter Premium Amount"
          />
        </div>

        <div className="field-row-stacked mx-6">
          <label
            htmlFor="numberOfPolicies"
            className="block text-sm font-medium text-xl text-black"
          >
            Number of Policies
          </label>
          <input
            id="numberOfPolicies"
            name="numberOfPolicies"
            type="number"
            value={formData.numberOfPolicies}
            onChange={handleChange}
            className="w-full border p-1 bg-white text-black"
            placeholder="Enter Number Of Policies"
          />
        </div>

        <div className="mx-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-xl text-black pb-1"
              >
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border p-1 bg-white text-black"
              />
            </div>

            <div className="">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-xl text-black pb-1"
              >
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border p-1 bg-white text-black"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mx-6 mb-6">
          <button
            onClick={handleSubmit}
            className="w-1/3 text-black py-2 mt-4 rounded-md"
          >
            Create Policy
          </button>
        </div>
      </div>
    </div>
  );
}
