import { initializeApp } from 'firebase/app';
import * as rtdb from "firebase/database";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBWRe5gA3LueyoL6GMmOpqUBIIBYprWd4M",
    authDomain: "iotgreen-7df65.firebaseapp.com",
    databaseURL: "https://iotgreen-7df65-default-rtdb.firebaseio.com",
    projectId: "iotgreen-7df65",
    storageBucket: "iotgreen-7df65.appspot.com",
    messagingSenderId: "517113454172",
    appId: "1:517113454172:web:c65ff2695b97b865539099"
};  

const app = initializeApp(firebaseConfig);
const db = rtdb.getDatabase(app);

export default {
    app: app,
    db: db,
    rtdb: rtdb
}