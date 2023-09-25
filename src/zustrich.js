import { initializeApp } from 'firebase/app';
import { getDatabase, set, ref, onValue  } from 'firebase/database';
// import { nanoid } from 'nanoid'

export default async function ({type, time,idRoom}) {
    const firebaseConfig = {
    apiKey: process.env.API_KEY_FIREBASE,
    authDomain: "zustrich-be18b.firebaseapp.com",
    databaseURL: "https://zustrich-be18b-default-rtdb.firebaseio.com",
    projectId: "zustrich-be18b",
    storageBucket: "zustrich-be18b.appspot.com",
    messagingSenderId: "125274425353",
    appId: "1:125274425353:web:6f38bd6892f88805ee10d8",
    measurementId: "G-4MH57WVHBD"
    };

    if(type){
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);
        const room = nanoid()
        await set(ref(database, "rooms/" + room), {
            time: time,
            members:[]
        });

        return {idRoom: room}
    }else{
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const starCountRef = ref(database, 'rooms/');

    onValue(starCountRef, (snapshot) => {
        snapshot.forEach(childSnapshot => {
            if (childSnapshot.key === idRoom) {
                let newUs = childSnapshot.val().members;
                res.status(200).json({members: newUs})
            }
        });
        return {members: []}
    });
    }

}
