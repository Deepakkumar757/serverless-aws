// App.js

import { useAuth } from "react-oidc-context";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import ContactList, { type ContactItem } from "./components/list";
import ContactModal from "./components/viewModal";
import { setToken } from "./lib/axios";
import {
  getContactById,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "./services/api";
import type { ContactFormMode, ContactFormValues } from "./components/form";
import ConfirmationModal from "./components/confirmationModal";

function App() {
  const auth = useAuth();
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(
    null
  );
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "view">("view");
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);

  const fetchContacts = useCallback(async () => {
    const contacts = await getContacts();
    setContacts(contacts.data);
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      const token = auth.user?.id_token;
      if (token) {
        setToken(token).then(() => {
          fetchContacts();
        });
      }
    }
  }, [auth.isAuthenticated]);

  // const signOutRedirect = () => {
  //   const clientId = env.CLIENT_ID;
  //   const logoutUri = "<logout uri>";
  //   const cognitoDomain = env.COGNITO_DOMAIN;
  //   window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
  //     logoutUri
  //   )}`;
  // };
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  const handleCreateClick = () => {
    setModalMode("create");
    setSelectedContact(null);
    setModalOpen(true);
  };

  const handleViewClick = async(contact: ContactItem) => {
    setModalMode("view");
    const data = await getContactById(contact.id);
    setSelectedContact(data.data);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleConfirmationModalClose = () => {
    setConfirmationModalOpen(false);
  };

  const handleSave = async(data:ContactFormValues, mode:ContactFormMode)=>{
    try {
      const api = mode === "create" ? createContact : updateContact;
      await api(data as ContactItem);
      handleModalClose();
      await fetchContacts();
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteContact = async()=>{
    try {
      if(!selectedContactId) return;
      await deleteContact(selectedContactId);
      handleConfirmationModalClose();
      await fetchContacts();
    } catch (error) {
      console.log(error);
    }
  }



  if (auth.isAuthenticated) {
    return (
      <>
        <ContactList
          contacts={contacts}
          onCreate={handleCreateClick}
          onDelete={(id)=>{
            setSelectedContactId(id);
            setConfirmationModalOpen(true);
          }}
          onView={handleViewClick}
        />
        <ContactModal
          isOpen={isModalOpen}
          mode={modalMode}
          data={selectedContact ?? undefined}
          onClose={handleModalClose}
          onSave={handleSave}
        />
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onCancel={handleConfirmationModalClose}
          onConfirm={handleDeleteContact}
          title="Delete contact"
          message="Are you sure you want to delete this contact? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      </>
    );
  }
  return (
    <div className="flex justify-center items-center space-x-4 my-8 h-screen">
      <button
        onClick={() => auth.signinRedirect()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        Sign in
      </button>
    </div>
  );
}

export default App;
