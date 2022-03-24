import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import withAuth from "../Auth/withAuth";
import Contacts from "../components/Contacts";
import { contactCollection } from "../db/collections";
import { Contact, ContactSerializable } from "../types/DbModels";
import LoginUser from "../types/LoginUser";

const ContactsPage: NextPage<{contacts: ContactSerializable[]}> = (props) => {
    const contacts = props.contacts as ContactSerializable[];
    return <div>
        <Contacts heading="Your contacts" contactList={contacts}></Contacts>
    </div>
}

export default ContactsPage;

export const getServerSideProps: GetServerSideProps = withAuth(async (ctx:GetServerSidePropsContext, loginUser: LoginUser) => {
    
    if(loginUser){
        const contacts = await (await contactCollection()).find({userId: loginUser._id}).toArray() as Contact[];
        const contactsSerializable: ContactSerializable[] = contacts.map(contact => {return {...contact, userId: contact.userId?.toString(), _id: contact._id?.toString()}})
        return {
            props: {contacts: contactsSerializable, loginUser: {...loginUser, _id: loginUser._id.toString()}}
        }
    }

    return {
        props: {}
    }
});