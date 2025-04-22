"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Pencil, Trash2 } from "lucide-react";

export default function ManageSizeModal({ data, setData }) {
  const [editSize, setEditSize] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({});

  const addSize = () => {
    if (
      currentEdit.name === "" ||
      currentEdit.size === "" ||
      currentEdit.price === "" ||
      currentEdit.stock === ""
    ) {
      return;
    }

    if (data && data.sizes) {
      setData({ ...data, sizes: [...data.sizes, currentEdit] });
      return setCurrentEdit({});
    }

    setData({ ...data, sizes: [currentEdit] });
    return setCurrentEdit({});
  };

  const saveSize = () => {
    if (
      currentEdit.name === "" ||
      currentEdit.size === "" ||
      currentEdit.price === "" ||
      currentEdit.stock === ""
    ) {
      return;
    }

    const updatedSizes = data.sizes.map((size) => {
      if (
        size.name === currentEdit.name &&
        size.size === currentEdit.size &&
        size.price === currentEdit.price
      ) {
        return {
          ...size,
          size: newSizeObject.size,
          price: newSizeObject.price,
          stock: newSizeObject.stock,
          isAvailable: newSizeObject.isAvailable,
        };
      }
      return size;
    });

    setEditSize(false);

    if (data && data.sizes) return setData({ ...data, sizes: updatedSizes });
    return setData({ ...data, sizes: [newSizeObject] });
  };

  const removeSize = (name) => {
    if (!data) return;

    const updated = data?.sizes.filter((s) => {
      if (s.name === name) return false;
      return true;
    });

    return setData({ ...data, sizes: updated });
  };

  return (
    <div className="px-2 py-3 border border-slate-200 bg-white rounded-xl shadow-xs">
      <div className="mb-3 p-2">
        <div
          className={`px-3 py-2 mb-2 ${editSize ? "bg-green-700 text-white" : "bg-slate-700 text-white"} text-xs font-bold rounded-lg`}
        >
          {editSize ? "Editing Size" : "Add New Size"}
        </div>

        <div className="p-2 border border-slate-200 rounded-lg">
          <form onSubmit={saveSize}>
            <div className="mb-2">
              <input
                type="text"
                name="name"
                placeholder="Size name"
                value={currentEdit.name || ""}
                onChange={(e) =>
                  setCurrentEdit({ ...currentEdit, name: e.target.value })
                }
                className="w-full text-sm px-1 py-2 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white"
              />
            </div>

            <div className="relative w-full flex items-center gap-2 mb-2">
              <input
                type="number"
                name="size"
                placeholder="mm"
                value={currentEdit.size || ""}
                onChange={(e) =>
                  setCurrentEdit({ ...currentEdit, size: e.target.value })
                }
                className="w-1/3 text-sm px-1 py-2 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white"
              />
              <input
                type="number"
                name="price"
                placeholder="¥ Price"
                value={currentEdit.price || ""}
                onChange={(e) =>
                  setCurrentEdit({ ...currentEdit, price: e.target.value })
                }
                className="w-1/3 text-sm px-1 py-2 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white"
              />
              <input
                type="number"
                placeholder="Stock"
                name="stock"
                value={currentEdit.stock || ""}
                onChange={(e) =>
                  setCurrentEdit({ ...currentEdit, stock: e.target.value })
                }
                className="w-1/3 text-sm px-1 py-2 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white"
              />
            </div>

            <div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="submit"
                className={`w-full px-4 py-2 ${editSize ? "bg-green-700 text-white" : "bg-slate-700 text-white"} text-sm font-bold rounded-lg`}
              >
                {editSize ? "Save" : "Add"}
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      {data && data?.sizes && (
        <div className="px-3 py-3 text-sm border border-slate-200 bg-white rounded-xl shadow-xs">
          <table className="w-full">
            <thead>
              <tr>
                {["Item", "Price", "Stock", ""].map((heading, i) => (
                  <th className="text-left mb-2" key={`heading-${i}`}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.sizes.map((size, i) => (
                <tr
                  className="text-sm border-b border-slate-300 rounded-xl"
                  key={`size-${i}`}
                >
                  <td className="w-4/12 py-2">
                    {size.name}
                    <br />
                    <span className="text-xs text-slate-500">
                      {size.size} mm
                    </span>
                  </td>
                  <td className="w-4/12 text-xs py-2">
                    ¥ {size.price} <span className="text-[10px]">ea.</span>
                  </td>
                  <td className="w-2/12 py-2">{size.stock}</td>
                  <td className="w-2/12 py-2">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <button
                        type="button"
                        className="p-2 bg-red-600 text-white rounded-full"
                        onClick={() => removeSize(size.name, size.size)}
                      >
                        <Trash2 size={14} />
                      </button>

                      <button
                        type="button"
                        className="p-2 bg-green-700 text-white rounded-full"
                        onClick={() => {
                          setEditSize(true);
                          setCurrentEdit({
                            name: size.name,
                            size: size.size,
                            price: size.price,
                            stock: size.stock,
                          });
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
