import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { getContact } from "../api/ContactService";
import { toastError, toastSuccess } from "../api/ToastService";

const ContactDetail = ({ updateContact, updateImage }) => {
  const inputRef = useRef(null);
  const { id } = useParams();

  const [contact, setContact] = useState(null);

  /* FETCH CONTACT */
  const fetchContact = useCallback(async () => {
    try {
      const res = await getContact(id);
      setContact(res.data);
    } catch (err) {
      toastError(err.response?.data?.message || err.message);
    }
  }, [id]);

  /* SELECT IMAGE */
  const selectImage = () => inputRef.current?.click();

  /* UPDATE PHOTO */
  const updatePhoto = async (file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", id);

      await updateImage(formData);

      setContact((prev) => ({
        ...prev,
        photoUrl: `${prev.photoUrl}?t=${Date.now()}`
      }));

      toastSuccess("Photo updated");
    } catch (err) {
      toastError(err.response?.data?.message || err.message);
    }
  };

  /* INPUT CHANGE */
  const onChange = (e) =>
    setContact((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* UPDATE CONTACT */
  const onUpdateContact = async (e) => {
    e.preventDefault();
    try {
      await updateContact(contact);
      toastSuccess("Contact Updated");
      fetchContact();
    } catch (err) {
      toastError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  if (!contact) return null;

  return (
    <>
      <Link to="/contacts" className="link">
        <i className="bi bi-arrow-left"></i> Back to list
      </Link>

      <div className="profile">
        <div className="profile__details">
          <img
            src={contact.photoUrl || "/user.png"}
            alt={`Profile of ${contact.name}`}
          />

          <div className="profile__metadata">
            <p className="profile__name">{contact.name}</p>
            <p className="profile__muted">
              JPG, GIF or PNG. Max size 10MB
            </p>

            <button onClick={selectImage} className="btn">
              <i className="bi bi-cloud-upload"></i> Change Photo
            </button>
          </div>
        </div>

        <div className="profile__settings">
          <form onSubmit={onUpdateContact} className="form">
            <div className="user-details">
              {["name","email","phone","address","title","status"].map((field) => (
                <div className="input-box" key={field}>
                  <span className="details">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>
                  <input
                    type="text"
                    name={field}
                    value={contact[field] || ""}
                    onChange={onChange}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="form_footer">
              <button type="submit" className="btn">Save</button>
            </div>
          </form>
        </div>
      </div>

      <input
        type="file"
        hidden
        ref={inputRef}
        accept="image/*"
        onChange={(e) => updatePhoto(e.target.files[0])}
      />
    </>
  );
};

export default ContactDetail;
