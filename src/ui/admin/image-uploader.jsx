"use client";

import { motion } from "motion/react";

import { Trash2, Circle, CircleCheck } from "lucide-react";

export default function ImageUpload({ data, setData }) {
  // * Resize the selected image to save storage space.
  const resizeImage = (file, index, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            resolve({
              blob,
              name: (
                index +
                "-" +
                file.name.toLowerCase().replace(/\s+/g, "-")
              ).split(".")[0],
              preview: img.src,
            });
          },
          "image/jpeg",
          0.8
        );
      };

      img.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const resize = await Promise.all(
      imageFiles.map(async (file, index) => {
        return await resizeImage(file, index, 1080, 1080);
      })
    );

    data && data.media
      ? setData({ ...data, media: [...data.media, ...resize] })
      : setData({ ...data, media: resize });
  };

  const removeImage = (name) => {
    if (!data) return;

    const updated = data.media.filter((image) => {
      return image.name !== name;
    });

    return setData({ ...data, media: updated });
  };

  const makeThumbnail = (name) => {
    if (!data) return;
    return setData({ ...data, thumbnail: { name } });
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      <motion.div
        layout
        className={`${data.media && data.media.length >= 1 ? "" : "col-span-4 row-span-2"} flex items-center justify-center`}
      >
        <label
          htmlFor="uploadFile"
          className="p-2 flex flex-col items-center justify-center w-full border border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <motion.svg
              layout
              className={`${data.media && data.media.length >= 1 ? "w-4 h-4" : "w-8 h-8"} mb-2 text-gray-500`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </motion.svg>
            <motion.p layout className="text-xs text-center text-gray-500">
              <span className="font-semibold">Click to upload</span>
            </motion.p>
          </div>
          <input
            id="uploadFile"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </motion.div>

      {data &&
        data.media &&
        data.media.map((image, i) => (
          <div key={`image-${i}`} className="relative h-32">
            <img
              src={image.preview || image.url}
              alt={`preview-${i}`}
              className="w-full h-full object-cover border border-slate-300 rounded"
            />
            <span
              onClick={() => removeImage(image.name)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 cursor-pointer"
            >
              <Trash2 size={14} />
            </span>
            <span
              onClick={() => makeThumbnail(image.name)}
              className={`absolute -bottom-2 -bg-conic-120 right-1/2 translate-x-1/2 ${data.thumbnail?.name === image.name ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-500"}  rounded-full p-1 cursor-pointer`}
            >
              {data && data.thumbnail?.name === image.name ? (
                <CircleCheck size={14} />
              ) : (
                <Circle size={14} />
              )}
            </span>
          </div>
        ))}
    </div>
  );
}
