import React from "react";
import ContactForm, { type ContactFormMode, type ContactFormValues } from "./form";

export type Mode = ContactFormMode;
export type ContactItem = ContactFormValues;

interface Props {
  isOpen: boolean;
  mode: Mode;
  data?: ContactItem;
  onClose: () => void;
  onSave: (data: ContactItem, mode: Mode) => Promise<void> | void;
}

const descriptions: Record<Mode, string> = {
  create: "Fill in the details below to create a new contact entry.",
  view: "Review the contact information below. Tap edit to make changes.",
};

const ContactModal: React.FC<Props> = ({ isOpen, mode, data, onClose, onSave }) => {
  if (!isOpen) return null;

  const handleSubmit = async (values: ContactFormValues) => {
    await Promise.resolve(onSave(values, mode));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"
          aria-label="Close modal"
        >
          ✕
        </button>

        <ContactForm
          mode={mode}
          variant="modal"
          initialData={data}
          description={descriptions[mode]}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default ContactModal;
