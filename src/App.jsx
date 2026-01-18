import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Header from "./components/Header";
import ContactList from "./components/ContactList";
import ContactDetail from "./components/ContactDetail";
import Register from "./components/Register";
import Login from "./components/Login";

import {
  getContacts,
  saveContact,
  updatePhoto,
  updateContact as updateContactApi,
} from "./api/ContactService";

import { toastError } from "./api/ToastService";

function App() {
  const modalRef = useRef(null);
  const fileRef = useRef(null);

  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
  });

  /* ================= AUTH ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  /* ================= CONTACTS ================= */
  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const res = await getContacts(page, size);
      setData(res.data);
    } catch (err) {
      toastError(err.response?.data?.message || err.message);
    }
  };

  const onChange = (e) =>
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* ================= CREATE CONTACT ================= */
  const handleNewContact = async (e) => {
    e.preventDefault();

    try {
      const res = await saveContact(values);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", res.data.id);

      await updatePhoto(formData);

      toggleModal(false);
      resetForm();
      getAllContacts();
    } catch (err) {
      toastError(err.response?.data?.message || err.message);
    }
  };

  const resetForm = () => {
    setFile(null);
    fileRef.current.value = null;
    setValues({
      name: "",
      email: "",
      phone: "",
      address: "",
      title: "",
      status: "",
    });
  };

  /* ================= UPDATE CONTACT ================= */
  const updateContact = async (contact) => {
    try {
      await updateContactApi(contact);
    } catch (err) {
      toastError(err.response?.data?.message || err.message);
    }
  };

  const updateImage = async (formData) => {
    try {
      await updatePhoto(formData);
    } catch (err) {
      toastError(err.response?.data?.message || err.message);
    }
  };

  /* ================= MODAL ================= */
  const toggleModal = (show) =>
    show ? modalRef.current.showModal() : modalRef.current.close();

  /* ================= LOAD ================= */
  useEffect(() => {
    if (isAuthenticated) getAllContacts();
  }, [isAuthenticated]);

  /* ================= ROUTES ================= */
  const Protected = (component) =>
    isAuthenticated ? component : <Navigate to="/login" />;

  return (
    <>
      {isAuthenticated && (
        <Header
          toggleModal={toggleModal}
          nbOfContacts={data?.totalElements || 0}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />

        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/contacts" /> : <Register />}
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/contacts" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        <Route
          path="/contacts"
          element={Protected(
            <ContactList
              data={data}
              currentPage={currentPage}
              getAllContacts={getAllContacts}
            />
          )}
        />

        <Route
          path="/contacts/:id"
          element={Protected(
            <ContactDetail
              updateContact={updateContact}
              updateImage={updateImage}
            />
          )}
        />
      </Routes>

      {/* MODAL */}
      <dialog ref={modalRef} className="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>

        <div className="divider"></div>

        <form onSubmit={handleNewContact}>
          <div className="user-details">
            {["name", "email", "title", "phone", "address", "status"].map(
              (field) => (
                <div className="input-box" key={field}>
                  <span className="details">{field}</span>
                  <input
                    name={field}
                    value={values[field]}
                    onChange={onChange}
                    required
                  />
                </div>
              )
            )}

            <div className="file-input">
              <span className="details">Profile Photo</span>
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
          </div>

          <div className="form_footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => toggleModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn">
              Save
            </button>
          </div>
        </form>
      </dialog>

      <ToastContainer position="top-right" autoClose={1500} />
    </>
  );
}

export default App;
