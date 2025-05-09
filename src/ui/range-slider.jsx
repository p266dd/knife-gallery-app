"use client";

import Slider from "rc-slider";
import _ from "lodash";

import "rc-slider/assets/index.css";

export default function RangeSlider({
  label = "label",
  min = 0,
  max = 100,
  data,
  setData,
  currentSearch = "",
}) {
  const handleOnChange = (value) => {
    // Add to the search params.
    if (label === "Price")
      return setData({ ...data, price: { min: value[0], max: value[1] } });
    if (label === "Size")
      return setData({ ...data, size: { min: value[0], max: value[1] } });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(price);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold">
          {label === "Price"
            ? formatPrice(data[label.toLowerCase()]?.min || min)
            : data[label.toLowerCase()]?.min || min + " mm"}
        </div>
        <div className="text-sm font-semibold">
          {label === "Price"
            ? formatPrice(data[label.toLowerCase()]?.max || max)
            : data[label.toLowerCase()]?.max || max + " mm"}
        </div>
      </div>
      <Slider
        range
        min={min}
        max={max}
        step={10}
        defaultValue={[
          currentSearch ? currentSearch.split("-")[0] : min,
          currentSearch ? currentSearch.split("-")[1] : max,
        ]}
        onChange={handleOnChange}
        styles={{
          handle: {
            backgroundColor: "#1d293d",
            borderColor: "#1d293d",
            opacity: 1,
            boxShadow: "none",
          },
          track: {
            backgroundColor: "#62748e",
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
