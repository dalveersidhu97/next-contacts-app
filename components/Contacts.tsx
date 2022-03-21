import { FunctionComponent } from "react";
import { ContactSerializable } from "../types/DbModels";
import styles from "./Contacts.module.css";

const Contacts: FunctionComponent<{ heading:string, contactList: ContactSerializable[] }> = ({heading, contactList}) => {
  const contacts = contactList;

  if (contacts.length == 0) {
    return (
      <div>
        <h1>No contacts</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{heading}</h1>
      <ul className={styles.contactList}>
        {contacts.map((contact) => (
          <li key={contact._id} className={styles.contact}>
              <span>
                
                  <img
                    src={contact.image}
                  />
                
              </span>
              <span>
                <b>{contact.name}</b>
                <br />
                <span>{contact.phone}</span>
                <br />
                <span>{contact.email}</span>
                <br />
              </span>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
