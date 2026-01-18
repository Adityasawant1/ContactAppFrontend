import { Link } from "react-router-dom";

const Contact = ({ contact }) => {
  if (!contact) return null;

  const {
    id,
    name = "",
    title = "",
    email = "",
    address = "",
    phone = "",
    status = "",
    photoUrl
  } = contact;

  return (
    <Link to={`/contacts/${id}`} className="contact__item">
      <div className="contact__header">
        <div className="contact__image">
          <img
            src={photoUrl || "/user.png"}
            alt={name}
            loading="lazy"
          />
        </div>

        <div className="contact__details">
          <p className="contact_name">{name.slice(0, 15)}</p>
          <p className="contact_title">{title}</p>
        </div>
      </div>

      <div className="contact__body">
        <p><i className="bi bi-envelope"></i> {email.slice(0, 20)}</p>
        <p><i className="bi bi-geo"></i> {address}</p>
        <p><i className="bi bi-telephone"></i> {phone}</p>

        <p>
          <i className={`bi ${status === "Active" ? "bi-check-circle" : "bi-x-circle"}`}></i>
          {" "} {status}
        </p>
      </div>
    </Link>
  );
};

export default Contact;
