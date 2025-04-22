"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  JapaneseYen,
  Layers,
  Pencil,
  PlusCircle,
  Ruler,
  Save,
  Trash2,
} from "lucide-react";

import { addToSizes, updateSize, deleteSize } from "@/actions/sizes";

export default function ManageSizeModal({ data, setData }) {
  const [editSize, setEditSize] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({});

  const addSize = (e) => {
    e.preventDefault();

    if (!currentEdit.name) return;

    const newSize = {
      name: currentEdit.name,
      size: Number(currentEdit.size),
      price: Number(currentEdit.price),
      stock: Number(currentEdit.stock),
      productId: data.id,
    };

    addToSizes(newSize)
      .then((res) => {
        if (data && data.sizes) {
          setData({ ...data, sizes: [...data.sizes, currentEdit] });
        }

        setEditSize(false);
        return setCurrentEdit({});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveSize = (e) => {
    e.preventDefault();

    if (!currentEdit.price || !currentEdit.stock) {
      return;
    }

    const updatedSize = {
      name: currentEdit.name,
      size: Number(currentEdit.size),
      price: Number(currentEdit.price),
      stock: Number(currentEdit.stock),
      productId: data.id,
    };

    updateSize(updatedSize, currentEdit.sizeId)
      .then((res) => {
        const updatedSizes = data.sizes.map((size) => {
          if (
            size.name === currentEdit.name &&
            size.size === currentEdit.size
          ) {
            return {
              ...size,
              price: currentEdit.price,
              stock: currentEdit.stock,
            };
          }
          return size;
        });

        setData({ ...data, sizes: updatedSizes });

        setEditSize(false);
        return setCurrentEdit({});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeSize = (name, size, id) => {
    if (!data) return;

    deleteSize(id)
      .then((res) => {
        const updated = data?.sizes.filter((s) => {
          if (s.name === name && s.size === size) return false;
          return true;
        });

        return setData({ ...data, sizes: updated });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="px-2 py-3 border border-slate-200 bg-white rounded-xl shadow-xs">
      <div className="mb-3 p-2">
        {editSize && (
          <div className="px-3 py-2 mb-2 bg-green-700 text-white text-xs font-bold rounded-lg">
            Editing Size
          </div>
        )}

        <div className="p-2 border border-slate-200 rounded-lg">
          <div className="mb-2">
            <input
              type="text"
              name="name"
              placeholder="Size name"
              value={currentEdit.name || ""}
              disabled={editSize}
              onChange={(e) =>
                setCurrentEdit({ ...currentEdit, name: e.target.value })
              }
              className="w-full text-sm px-2 py-2 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white disabled:bg-slate-100"
            />
          </div>

          <div className="relative w-full flex items-center gap-2 mb-2">
            <div className="relative w-1/3">
              <input
                type="number"
                name="size"
                placeholder="mm"
                value={currentEdit.size || ""}
                disabled={editSize}
                onChange={(e) =>
                  setCurrentEdit({ ...currentEdit, size: e.target.value })
                }
                className="w-full text-sm px-1 py-2 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white disabled:bg-slate-100"
              />
              <span className="absolute top-3 right-3 z-50">
                <Ruler size={12} />
              </span>
            </div>

            <div className="relative w-1/3">
              <input
                type="number"
                name="price"
                placeholder="¥ Price"
                value={currentEdit.price || ""}
                onChange={(e) =>
                  setCurrentEdit({ ...currentEdit, price: e.target.value })
                }
                className="w-full text-sm px-1 py-2 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white"
              />
              <span className="absolute top-3 right-3 z-50">
                <JapaneseYen size={12} />
              </span>
            </div>

            <div className="relative w-1/3">
              <input
                type="number"
                placeholder="Stock"
                name="stock"
                value={currentEdit.stock || ""}
                onChange={(e) =>
                  setCurrentEdit({ ...currentEdit, stock: e.target.value })
                }
                className="w-full text-sm px-1 py-2 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white"
              />
              <span className="absolute top-3 right-3 z-50">
                <Layers size={12} />
              </span>
            </div>
          </div>

          <div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={editSize ? saveSize : addSize}
              className={`w-full px-4 py-2 ${editSize ? "bg-green-700 text-white" : "bg-slate-700 text-white"} text-sm font-bold rounded-lg`}
            >
              {editSize ? (
                <span>
                  <Save className="inline-block mr-3" size={16} /> Save
                </span>
              ) : (
                <span>
                  <PlusCircle className="inline-block mr-3" size={16} /> Add New
                  Size
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {data && data?.sizes && (
        <div className="px-3 py-3 text-sm bg-white rounded-xl shadow-xs">
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
                <motion.tr
                  layout
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
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
                        onClick={() =>
                          removeSize(size.name, size.size, size.id)
                        }
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
                            sizeId: size.id,
                          });
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
