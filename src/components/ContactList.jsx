import Contact from "./Contact";

const ContactList = ({ data, currentPage, getAllContacts }) => {
  const contacts = data?.content || [];
  const totalPages = data?.totalPages || 0;

  return (
    <main className="main">
      {contacts.length === 0 && (
        <div>No Contacts. Please add a new contact.</div>
      )}

      <ul className="contact__list">
        {contacts.map((contact) => (
          <Contact contact={contact} key={contact.id} />
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="pagination">
          {/* PREV */}
          <button
            onClick={() => getAllContacts(currentPage - 1)}
            disabled={currentPage === 0}
          >
            &laquo;
          </button>

          {/* PAGE NUMBERS */}
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => getAllContacts(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page + 1}
            </button>
          ))}

          {/* NEXT */}
          <button
            onClick={() => getAllContacts(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            &raquo;
          </button>
        </div>
      )}
    </main>
  );
};

export default ContactList;
