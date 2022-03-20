
import { connectToDatabase } from "./getClient"

export const userCollection = async () => {
    
        const db = await connectToDatabase();
        return db.collection('User');
    
}

export const contactCollection = async () => {
    
    const db = await connectToDatabase();
    return db.collection('Contacts');

}
