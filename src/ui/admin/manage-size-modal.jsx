"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  JapaneseYen,
  Layers,
  Pencil,
  PlusCircle,
  Ruler,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";

import { addToSizes, updateSize, deleteSize } from "@/actions/sizes";
import ConfirmModal from "../confirm-modal";

export default function ManageSizeModal({ data, setData, edit = false }) {
  const [editSize, setEditSize] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({});
  const sizeNameRef = useRef(null);

  const addSize = (e) => {
    e.preventDefault();

    if (!currentEdit.name || !currentEdit.size || !currentEdit.price || !currentEdit.stock) return;

    const newSize = {
      name: currentEdit.name,
      size: String(currentEdit.size),
      price: Number(currentEdit.price),
      stock: Number(currentEdit.stock),
    };

    if (edit) {
      return addToSizes({ ...newSize, productId: data.id })
        .then((res) => {
          setData((prev) =>
            prev?.sizes
              ? { ...prev, sizes: [...prev.sizes, newSize] }
              : { ...prev, sizes: [newSize] }
          );

          sizeNameRef.current.focus();
          return setCurrentEdit({});
        })
        .catch((error) => {
          console.log(error);
        });
    }

    setData((prev) =>
      prev?.sizes ? { ...prev, sizes: [...prev.sizes, newSize] } : { ...prev, sizes: [newSize] }
    );

    sizeNameRef.current.focus();
    return setCurrentEdit({});
  };

  const saveSize = (e) => {
    e.preventDefault();

    if (!currentEdit.price || !currentEdit.stock) {
      return;
    }

    const updatedSize = {
      id: Number(currentEdit.id),
      name: currentEdit.name,
      size: String(currentEdit.size),
      price: Number(currentEdit.price),
      stock: Number(currentEdit.stock),
      productId: data.id,
    };

    if (edit) {
      updateSize(updatedSize)
        .then((res) => {
          const updatedSizes = data.sizes.map((size) => {
            if (size.id === currentEdit.id) {
              return updatedSize;
            }
            return size;
          });

          setData({ ...data, sizes: updatedSizes });

          setEditSize(false);
          sizeNameRef.current.focus();
          return setCurrentEdit({});
        })
        .catch((error) => {
          console.log(error);
        });
    }

    const updatedSizes = data.sizes.map((size, i) => {
      if (i === currentEdit.id || size.id === currentEdit.id) {
        return updatedSize;
      }
      return size;
    });

    setData({ ...data, sizes: updatedSizes });

    setEditSize(false);
    sizeNameRef.current.focus();
    return setCurrentEdit({});
  };

  const removeSize = (id) => {
    if (!data) return;

    if (edit) {
      deleteSize(id)
        .then((res) => {
          const updated = data?.sizes.filter((s) => {
            if (s.id === id) return false;
            return true;
          });

          return setData({ ...data, sizes: updated });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    let updated = [];
    data?.sizes.map((s, i) => {
      if (i !== id) {
        return (updated = [...updated, s]);
      }
      return;
    });

    return setData({ ...data, sizes: updated });
  };

  return (
    <div className="px-2 py-3 border border-slate-200 bg-white rounded-xl shadow-xs">
      <div className="mb-3 p-2">
        {editSize && (
          <motion.div
            layout
            className="px-3 py-2 mb-2 bg-green-700 text-white text-xs font-bold rounded-lg"
          >
            Editing Size
          </motion.div>
        )}

        <motion.div layout>
          <div className="mb-2">
            <input
              ref={sizeNameRef}
              type="text"
              name="name"
              placeholder="Size name"
              autoComplete="off"
              value={currentEdit.name || ""}
              onChange={(e) => setCurrentEdit({ ...currentEdit, name: e.target.value })}
              className="w-full text-sm px-2 py-2 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white disabled:bg-slate-100"
            />
          </div>

          <div className="relative w-full flex items-center gap-2 mb-2">
            <div className="relative w-1/3">
              <input
                type="text"
                name="size"
                placeholder="mm"
                value={currentEdit.size || ""}
                onChange={(e) => setCurrentEdit({ ...currentEdit, size: e.target.value })}
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
                placeholder="Price"
                value={currentEdit.price || ""}
                onChange={(e) => setCurrentEdit({ ...currentEdit, price: e.target.value })}
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
                defaultValue={editSize ? (currentEdit.stock ? currentEdit.stock : 0) : ""}
                onChange={(e) => setCurrentEdit({ ...currentEdit, stock: e.target.value })}
                className="w-full text-sm px-1 py-2 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white"
              />
              <span className="absolute top-3 right-3 z-50">
                <Layers size={12} />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={editSize ? saveSize : addSize}
              className={`flex-grow px-4 py-2 ${editSize ? "bg-green-700 text-white" : "bg-slate-700 text-white"} text-sm font-bold rounded-lg`}
            >
              {editSize ? (
                <span>
                  <Save className="inline-block mr-3" size={16} /> Save
                </span>
              ) : (
                <span>
                  <PlusCircle className="inline-block mr-3" size={16} /> Add New Size
                </span>
              )}
            </motion.button>

            {editSize && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setEditSize(false);
                  setCurrentEdit({});
                }}
                className="w-1/3 px-4 py-2 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {data && data?.sizes && data?.sizes.length > 0 && (
        <div className="px-1 py-3 text-sm bg-white">
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
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-sm border-b last:border-b-0 border-slate-100 rounded-xl ${currentEdit.id && currentEdit.id === size.id ? "bg-slate-100" : ""}`}
                  key={`size-${i}`}
                >
                  <td className="w-4/12 py-2">
                    {size.name}
                    <br />
                    <span className="text-xs text-slate-500">{size.size + "mm"}</span>
                  </td>
                  <td className="w-4/12 py-2">
                    {new Intl.NumberFormat("ja-JP", {
                      style: "currency",
                      currency: "JPY",
                    }).format(size.price)}
                  </td>
                  <td className="w-2/12 py-2">
                    {size.stock === 0 ? (
                      <span className="flex items-center gap-2">
                        {size.stock} <XCircle size={14} className="stroke-red-500" />
                      </span>
                    ) : (
                      size.stock
                    )}
                  </td>
                  <td className="w-2/12 py-2">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <ConfirmModal action={() => removeSize(size.id || i)}>
                        <button type="button" className="p-2 text-slate-500">
                          <Trash2 size={14} />
                        </button>
                      </ConfirmModal>

                      <button
                        type="button"
                        className="p-2 text-slate-500"
                        onClick={() => {
                          setEditSize(true);
                          sizeNameRef.current.focus();
                          setCurrentEdit({
                            id: size.id || i,
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
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
