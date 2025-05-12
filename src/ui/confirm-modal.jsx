"use client";

import Modal from "./modal";

export default function ConfirmModal({ action, children }) {
  return (
    <Modal trigger={children}>
      <div className="px-4 py-5">
        <h4 className="text-2xl text-center font-light mb-2">
          You are about to delete this item!
        </h4>
        <p className="mb-4 text-center text-sm">Are you sure?</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={action}
            className="bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
}
