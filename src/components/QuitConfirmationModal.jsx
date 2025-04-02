/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const QuitConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-xs"
          >
            {/* Modal Header */}
            <div className="bg-[#16956C] p-4 text-white text-center">
              <h2 className="font-bold text-xl">
                Are you sure you want to quit?
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-4 text-center text-gray-600">
              <p className="mb-1">You will lose all points.</p>
              <p className="text-sm">
                Also, practicing questions increases your chance of
                participating in LIVE GAMES.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 flex space-x-3">
              <button
                onClick={onConfirm}
                className="flex-1 py-2 px-4 rounded border border-[#16956C] text-[#16956C] font-medium hover:bg-gray-50 transition-colors"
              >
                End Practice
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 rounded bg-[#16956C] text-white font-medium hover:bg-[#138055] transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuitConfirmationModal;
