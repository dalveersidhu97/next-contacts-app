import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import withAuth from "../Auth/withAuth";
import Contacts from "../components/Contacts";
import { contactCollection, userCollection } from "../db/collections";
import { Contact, ContactSerializable } from "../types/DbModels";
import LoginUser from "../types/LoginUser";

const ContactsPage: NextPage<{registredContacts: ContactSerializable[]}> = ({registredContacts}) => {
    
    return <div>
        <Contacts heading="Your contacts using ContactApp" contactList={registredContacts}></Contacts>
    </div>
}

export const getServerSideProps: GetServerSideProps = withAuth(async (ctx:GetServerSidePropsContext, loginUser: LoginUser) => {
    
    if(loginUser){
        const contacts = await (await contactCollection()).find({userId: loginUser._id}).toArray() as Contact[];
        const emails = contacts.map(contact=>contact.email);
        const phones = contacts.map(contact=>contact.phone);
        const registredContcts = await (await userCollection()).find({'$or':[{email: {'$in': emails}}, {phone: {'$in': phones}}]}).project({password: 0}).toArray() as Contact[];
        
        const contactsSerializable: ContactSerializable[] = contacts.map(contact => {return {...contact, userId: contact.userId?.toString(), _id: contact._id?.toString()}})
        const registredContacts: ContactSerializable[] = registredContcts.map(contact => {return {...contact, registered: true, userId: loginUser._id?.toString(), _id: contact._id?.toString()}})
        
        // const notRegisteredContacts = contactsSerializable.filter(contact=> {
        //     for(const c of registredContacts){
        //         if(c.email == contact.email || c.phone == contact.phone ) return false;
        //     }
        //     return true;
        // });

        return {
            props: {registredContacts}
        }
    }

    return {
        props: {}
    }
});

export default ContactsPage;
