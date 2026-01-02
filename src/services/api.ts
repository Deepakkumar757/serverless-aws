import api from "../lib/axios";
import type { ContactItem } from "../components/list";

export const getContacts = () => {
    return api.get("/", { params:{"test":"Deepak"}});
}

export const getContactById = (id: number) => {
    return api.get(`/${id}`);
}

export const createContact = (contact: Omit<ContactItem, "id">) => {
    return api.post("/", contact);
}

export const updateContact = (contact: ContactItem) => {
    return api.post(`/`, contact);
}

export const deleteContact = (id: number) => {
    return api.delete(`/${id}`);
}