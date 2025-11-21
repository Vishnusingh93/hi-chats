import { Client, Databases, Account,Storage } from 'appwrite';

// export const API_ENDPOINT =import.meta.env.VITE_API_ENDPOINT
// export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID
// export const DATABASE_ID =import.meta.env.VITE_DATABASE_ID
// export const COLLECTION_ID_MESSAGES= import.meta.env.VITE_COLLECTION_ID_MESSAGES
//  export const API_ENDPOINT="https://fra.cloud.appwrite.io/v1",
 export const PROJECT_ID="6856eb7000201b464f5b"
 export const DATABASE_ID="6856ed75000bb86b5dbc"
export const COLLECTION_ID_MESSAGES="6856eda1001b54f7bf78"
export const BUCKET_ID="6912dd540005110ed6d0"


const client = new Client();
client

    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6856eb7000201b464f5b');

    export const databases = new Databases(client);
    export const account = new Account(client);
    export const storage = new Storage(client);
    

    export default client;