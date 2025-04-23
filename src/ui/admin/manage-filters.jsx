"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { mutate } from "swr";
import { Settings, Trash2 } from "lucide-react";

import Modal from "../modal";
import { addFilter, deleteFilter } from "@/actions/filters";

export default function ManageFilters({ data, setData, filters }) {
  const [newFilter, setNewFilter] = useState("");

  const addNewFilter = (e) => {
    e.preventDefault();

    // * Don't do anything if the input is empty.
    if (newFilter === "") return;

    addFilter({ filterName: newFilter, productId: data.id })
      .then((res) => {
        setNewFilter("");

        // * Tell SWR about the change so it updates the caching..
        mutate("fetchFilters");
      })
      .catch((error) => console.log(error));
  };

  const removeFilter = (e, name) => {
    e.preventDefault();

    deleteFilter({ filterName: name })
      .then((res) => null)
      .catch((error) => console.log(error));

    // * Tell SWR about the change so it updates the caching..
    mutate("fetchFilters");
  };

  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {filters &&
          filters.length > 0 &&
          filters.map((filter, i) => (
            <label
              key={`filter-${i}`}
              className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                value={filter.id || ""}
                onChange={(e) => {
                  const selectedFilters = data.filters || [];
                  if (e.target.checked) {
                    return setData({
                      ...data,
                      filters: [
                        ...selectedFilters,
                        { id: filter.id, name: filter.name },
                      ],
                    });
                  }
                  return setData({
                    ...data,
                    filters: selectedFilters.filter((f) => f.id !== filter.id),
                  });
                }}
                checked={
                  (data.filters &&
                    data.filters.some((obj) => obj.id === filter.id)) ||
                  false
                }
              />
              <span className="text-sm">{filter.name}</span>
            </label>
          ))}
      </div>

      <div className="flex-shrink-0">
        <Modal
          trigger={
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              className="p-3 w-full flex items-center gap-2 text-xs font-semibold text-white bg-slate-700 rounded-xl"
            >
              <Settings size={16} /> Filters
            </motion.button>
          }
        >
          <div className="flex flex-col gap-3">
            <input
              required
              name="filterName"
              placeholder="Filter"
              onChange={(e) => setNewFilter(e.target.value)}
              value={newFilter}
              className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
            />

            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              className="w-full px-3 py-2 bg-slate-700 text-white text-sm font-semibold rounded-xl"
              onClick={addNewFilter}
            >
              Add Filter
            </motion.button>
          </div>
          <div className="h-auto max-h-52 overflow-y-auto">
            {filters && filters.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold">Existing Filters</h4>
                <ul className="flex flex-col gap-2 mt-2">
                  {filters.map((filter, i) => (
                    <li
                      key={`filter-l-${i}`}
                      className="flex items-center justify-between p-2 pr-4 border border-slate-200 rounded-lg"
                    >
                      {filter.name}
                      <button
                        type="button"
                        className="text-red-600 cursor-pointer"
                        onClick={(e) => {
                          removeFilter(e, filter.name);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}
