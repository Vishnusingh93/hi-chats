import { Client, Databases, Account,Storage } from 'appwrite';


export const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID_MESSAGES = import.meta.env.VITE_APPWRITE_COLLECTION_ID_MESSAGES;
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;



const client = new Client();
client

    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID);

    export const databases = new Databases(client);
    export const account = new Account(client);
    export const storage = new Storage(client);
    

    export default client;