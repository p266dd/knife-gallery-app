"use client";

import { useState } from "react";
import { redirect, RedirectType } from "next/navigation";
import { Search } from "lucide-react";
import SearchPreview from "./search-preview";
import RangeSlider from "./range-slider";
import Accordion from "./accordion";

export default function SearchForm({ brands = [], materials = [] }) {
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    handle: [],
    stock: [],
    price: {},
    size: {},
    brand: [],
    material: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // * Create searchparams from object.
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(searchData)) {
      if (key === "price") {
        // Only append if min/max are defined to avoid "undefined-undefined"
        if (value.min !== undefined && value.max !== undefined) {
          searchParams.append(key, `${value.min}-${value.max}`);
        }
      } else if (key === "size") {
        // Only append if min/max are defined
        if (value.min !== undefined && value.max !== undefined) {
          searchParams.append(key, `${value.min}-${value.max}`);
        }
      } else if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    }

    redirect(`/results?${searchParams.toString()}`, RedirectType.push);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-9">
        <SearchPreview data={searchData} setData={setSearchData} />
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center gap-3">
          <label
            htmlFor="japanesehandle"
            className="flex-grow px-3 py-2 pb-1 bg-slate-50 rounded-lg"
          >
            <input
              id="japanesehandle"
              type="checkbox"
              name="handle"
              className="mr-3"
              onChange={(e) => {
                e.target.checked
                  ? searchData.handle.push("japanese")
                  : searchData.handle.filter((handle) => handle !== "japanese");
              }}
            />
            Japanese
          </label>
          <label
            htmlFor="westernhandle"
            className="flex-grow px-3 py-2 pb-1 bg-slate-50 rounded-lg"
          >
            <input
              id="westernhandle"
              name="handle"
              type="checkbox"
              className="mr-3"
              onChange={(e) => {
                e.target.checked
                  ? searchData.handle.push("western")
                  : searchData.handle.filter((handle) => handle !== "western");
              }}
            />
            Western
          </label>
        </div>

        <div>
          <label
            htmlFor="stockonly"
            className="block w-full px-3 py-2 pb-1 bg-slate-50 rounded-lg"
          >
            <input
              id="stockonly"
              name="stock"
              type="checkbox"
              className="mr-3"
              onChange={(e) => {
                e.target.checked
                  ? searchData.stock.push("inStock")
                  : searchData.stock.filter((stock) => stock !== "inStock");
              }}
            />
            Only items in stock
          </label>
        </div>

        <div>
          <label
            htmlFor="largeStock"
            className="block w-full px-3 py-2 pb-1 bg-slate-50 rounded-lg"
          >
            <input
              id="largeStock"
              name="stock"
              type="checkbox"
              className="mr-3"
              onChange={(e) => {
                e.target.checked
                  ? searchData.stock.push("largeStock")
                  : searchData.stock.filter((stock) => stock !== "largeStock");
              }}
            />
            50 or more in stock
          </label>
        </div>
      </div>

      <div className="px-6 mb-5">
        <div className="mb-2">
          <RangeSlider
            label="Price"
            min={3200}
            max={10000}
            data={searchData}
            setData={setSearchData}
          />
        </div>

        <div className="mb-2">
          <RangeSlider
            label="Size"
            min={130}
            max={300}
            data={searchData}
            setData={setSearchData}
          />
        </div>
      </div>

      <div className="relative mb-5">
        <Accordion title="Brand">
          <div className="grid grid-cols-2 gap-3">
            {brands.map((brand, i) => (
              <label
                key={`brand-${i}`}
                htmlFor={`brand-${brand.name}`}
                className="flex items-center gap-2 bg-slate-50 px-3 py-2"
              >
                <input
                  id={`brand-${brand.name}`}
                  name="brand"
                  type="checkbox"
                  onChange={(e) => {
                    e.target.checked
                      ? searchData.brand.push(brand.name)
                      : searchData.brand.filter(
                          (brand) => brand !== brand.name
                        );
                  }}
                />
                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        </Accordion>
      </div>

      <div className="relative mb-5">
        <Accordion title="Material">
          <div className="grid grid-cols-2 gap-3">
            {materials.map((material, i) => (
              <label
                key={`material-${i}`}
                htmlFor={`material-${material.name}`}
                className="flex items-center gap-2 bg-slate-50 px-3 py-2"
              >
                <input
                  id={`material-${material.name}`}
                  type="checkbox"
                  onChange={(e) => {
                    e.target.checked
                      ? searchData.material.push(material.name)
                      : searchData.material.filter(
                          (material) => material !== material.name
                        );
                  }}
                />
                <span>{material.name}</span>
              </label>
            ))}
          </div>
        </Accordion>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 px-3 py-3 bg-slate-800 text-white rounded-xl"
        >
          <Search size={20} />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
