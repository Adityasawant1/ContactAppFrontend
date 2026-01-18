import API from "./axios";

export const saveContact = (contact) =>
  API.post("/contacts", contact);

export const getContacts = (page = 0, size = 10) =>
  API.get("/contacts", { params: { page, size } });

export const getContact = (id) =>
  API.get(`/contacts/${id}`);

export const updateContact = (contact) =>
  API.put("/contacts", contact);

export const updatePhoto = (formData) =>
  API.put("/contacts/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteContact = (id) =>
  API.delete(`/contacts/${id}`);
