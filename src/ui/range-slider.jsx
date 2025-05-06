"use client";

import Slider from "rc-slider";
import _ from "lodash";

import "rc-slider/assets/index.css";

export default function RangeSlider({ label = "label", data, setData }) {
  const handleOnChange = (value) => {
    // Add to the search params.
    if (label === "Price")
      return setData({ ...data, price: { min: value[0], max: value[1] } });
    if (label === "Size")
      return setData({ ...data, size: { min: value[0], max: value[1] } });
  };

  const min = 0;
  const max = 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold">
          {label === "Price" ? "¥ " : ""}
          {data[label.toLowerCase()]?.min || min}
          {label === "Size" ? " mm" : ""}
        </div>
        <div className="text-sm font-semibold">
          {label === "Price" ? "¥ " : ""}
          {data[label.toLowerCase()]?.max || max}
          {label === "Size" ? " mm" : ""}
        </div>
      </div>
      <Slider
        range
        min={min}
        max={max}
        step={10}
        defaultValue={[min, max]}
        onChange={handleOnChange}
        styles={{
          handle: {
            backgroundColor: "#1d293d",
            borderColor: "#1d293d",
            opacity: 1,
            boxShadow: "none",
          },
          track: {
            backgroundColor: "#1d293d",
          },
          rail: {
            backgroundColor: "#cccccc",
          },
        }}
      />
      <div>
        <p className="text-center font-semibold text-sm">{label}</p>
      </div>
    </div>
  );
}
