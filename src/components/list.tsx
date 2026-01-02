import React from "react";

export interface ContactItem {
  id: number;
  name: string;
  phone: string;
}

interface ListProps {
  onCreate: () => void;
  onDelete: (id: number) => void;
  onView: (contact: ContactItem) => void;
  contacts: ContactItem[];
}

const ContactList: React.FC<ListProps> = ({ onCreate, onDelete, onView, contacts }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      <div className="flex justify-end w-full h-[40px]">
        <button
          className="py-2 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          onClick={onCreate}
        >
          Create Contact
        </button>
      </div>

      <div className="w-full h-[calc(100vh-40px)]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Contact List
          </h1>
          <p className="text-slate-500 mt-1">
            View stored contact details below
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {contacts.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 border border-slate-200 rounded-2xl shadow-xl shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-1 transition-all duration-300 p-6 backdrop-blur-sm"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold flex justify-center items-center text-lg">
                  {item.name.charAt(0)}
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  {item.name}
                </h3>
              </div>

              {/* Phone */}
              <p className="mt-2 text-slate-500 text-sm">{item.phone}</p>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                  onClick={() => onView(item)}
                >
                  View
                </button>
                <button
                  className="flex-1 py-2 rounded-xl bg-red-100 text-red-600 text-sm font-medium hover:bg-red-200 transition"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Your data is safe and securely handled.
        </p>
      </div>
    </div>
  );
};

export default ContactList;
