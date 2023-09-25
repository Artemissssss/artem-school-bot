import { initializeApp } from 'firebase/app.js';
import { getDatabase, set, ref, onValue,  } from 'firebase/database';
import { nanoid } from 'nanoid'

export default async function handler(req, res) {
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

    if(req.body.type){
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);
        const room = nanoid()
        await set(ref(database, "rooms/" + room), {
            time: req.body.time,
            members:[]
        });

        await res.status(200).json({idRoom: room})
    }else{
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const starCountRef = ref(database, 'rooms/');

    onValue(starCountRef, (snapshot) => {
        snapshot.forEach(childSnapshot => {
            if (childSnapshot.key === req.body.idRoom) {
                let newUs = childSnapshot.val().members;
                res.status(200).json({members: newUs})
            }
        });
        res.status(200).json({members: []})
    });
    }

}
