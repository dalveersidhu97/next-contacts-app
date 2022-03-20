
import { MongoClient, Db } from "mongodb";

export async function connectToDatabase () {
    
    const client: MongoClient = new MongoClient(process.env.DB_CONN_STRING!);
            
    await client.connect();
        
    const db: Db = client.db(process.env.DB_NAME);

    return db

 }