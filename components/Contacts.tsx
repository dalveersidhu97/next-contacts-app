import { FunctionComponent } from "react";
import { ContactSerializable } from "../types/DbModels";

const Contacts: FunctionComponent<{contactList: ContactSerializable[]}> = (props) => {

    const contacts = props.contactList;

    if(contacts.length == 0){
        return <div>
            <h1>No contacts</h1>
        </div>
    }

    return <div>
            <h1>Contacts</h1>
            <ul>
                {contacts.map(contact => 
                    <li key={contact._id}>
                        <b>{contact.name}</b><br/>
                        <span>{contact.phone}</span><br/>
                        <span>{contact.email}</span><br/><br/>
                    </li>
                )}
            </ul>
        </div>
    
}

export default Contacts;