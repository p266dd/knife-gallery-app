"use client";

import { useState } from "react";
import { isArray } from "lodash";
import { redirect, RedirectType } from "next/navigation";
import { ArrowDownRight, Loader, Search } from "lucide-react";

import SearchPreview from "./search-preview";
import RangeSlider from "./range-slider";
import Accordion from "./accordion";

export default function SearchForm({
  brands = [],
  materials = [],
  currentSearch = {},
}) {
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    style: [],
    stock: [],
    price: {},
    size: {},
    brand: [],
    material: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

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
      } else if (key === "searchTerm") {
        // Only append if searchTerm isn't empty
        if (value !== "") {
          searchParams.append(key, value);
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
        <SearchPreview
          data={searchData}
          currentTerm={currentSearch.searchTerm}
          setData={setSearchData}
        />
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center gap-3">
          <label
            htmlFor="japanesehandle"
            className="flex-grow px-3 py-2 pb-1 bg-slate-50 rounded-lg"
          >
            <input
              id="japanesehandle"
              type="radio"
              name="style"
              className="mr-3"
              defaultChecked={
                currentSearch.style && currentSearch.style === "japanese"
              }
              onChange={(e) => {
                e.target.checked
                  ? (searchData.style = "japanese")
                  : (searchData.style = "");
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
              name="style"
              type="radio"
              className="mr-3"
              defaultChecked={
                currentSearch.style && currentSearch.style === "western"
              }
              onChange={(e) => {
                e.target.checked
                  ? (searchData.style = "western")
                  : (searchData.style = "");
              }}
            />
            Western
          </label>

          <label
            htmlFor="allhandle"
            className="flex-grow px-3 py-2 pb-1 bg-slate-50 rounded-lg"
          >
            <input
              id="allhandle"
              name="style"
              type="radio"
              className="mr-3"
              defaultChecked={!currentSearch?.style}
              onChange={(e) => {
                e.target.checked
                  ? (searchData.style = "")
                  : (searchData.style = "");
              }}
            />
            All
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
              type="radio"
              className="mr-3"
              defaultChecked={
                currentSearch?.stock &&
                currentSearch.stock.includes("largeStock")
              }
              onChange={(e) => {
                e.target.checked
                  ? (searchData.stock = "largeStock")
                  : (searchData.stock = "");
              }}
            />
            50 or more in stock
          </label>
        </div>

        <div>
          <label
            htmlFor="allStock"
            className="block w-full px-3 py-2 pb-1 bg-slate-50 rounded-lg"
          >
            <input
              id="allStock"
              name="stock"
              type="radio"
              className="mr-3"
              defaultChecked={!currentSearch?.stock}
              onChange={(e) => {
                e.target.checked
                  ? (searchData.stock = "")
                  : (searchData.stock = "");
              }}
            />
            All Items
          </label>
        </div>
      </div>

      <div className="px-6 mb-5">
        <div className="mb-2">
          <RangeSlider
            label="Price"
            min={2000}
            max={90000}
            currentSearch={currentSearch.price}
            data={searchData}
            setData={setSearchData}
          />
        </div>

        <div className="mb-2">
          <RangeSlider
            label="Size"
            min={70}
            max={350}
            currentSearch={currentSearch.size}
            data={searchData}
            setData={setSearchData}
          />
        </div>
      </div>

      <div className="relative mb-2">
        <Accordion title="Brand" icon={<ArrowDownRight size={16} />}>
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
                  defaultChecked={
                    currentSearch?.brand && isArray(currentSearch.brand)
                      ? currentSearch.brand.some((name) => name === brand.name)
                      : currentSearch.brand === brand.name
                  }
                  onChange={(e) => {
                    e.target.checked
                      ? searchData.brand.push(brand.name)
                      : (searchData.brand = searchData.brand.filter(
                          (brand) => brand !== brand.name
                        ));
                  }}
                />
                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        </Accordion>
      </div>

      <div className="relative mb-5">
        <Accordion title="Material" icon={<ArrowDownRight size={16} />}>
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
                  defaultChecked={
                    currentSearch?.material && isArray(currentSearch.material)
                      ? currentSearch.material.some(
                          (name) => name === material.name
                        )
                      : currentSearch.material === material.name
                  }
                  onChange={(e) => {
                    e.target.checked
                      ? searchData.material.push(material.name)
                      : (searchData.material = searchData.material.filter(
                          (material) => material !== material.name
                        ));
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
          className="w-full flex items-center justify-center gap-3 px-7 py-3 mx-auto bg-slate-800 text-white rounded-xl hover:cursor-pointer"
        >
          <Search className="stroke-white/40" size={20} />
          <span>Search</span>
          {loading && <Loader size={18} className="animate-spin" />}
        </button>
      </div>
    </form>
  );
}
