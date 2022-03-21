
import { MongoClient, Db } from "mongodb";

export async function connectToDatabase () {

    let connString = process.env.DB_CONN_STRING_DEV!;

    if(process.env.ENVIRONMENT?.toLocaleLowerCase() == 'production')
        connString = process.env.DB_CONN_STRING!

    const client: MongoClient = new MongoClient(connString);
            
    await client.connect();
        
    const db: Db = client.db(process.env.DB_NAME);

    console.log('MongoDB connected: ',process.env.DB_NAME)
    console.log('Environment: '+process.env.ENVIRONMENT);

    return db

 }