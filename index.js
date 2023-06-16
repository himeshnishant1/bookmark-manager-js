import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBvLoh-KsTHc-AsBtkBYalzxa5SET4RmA8",
    authDomain: "bookmark-f5d3a.firebaseapp.com",
    projectId: "bookmark-f5d3a",
    storageBucket: "bookmark-f5d3a.appspot.com",
    messagingSenderId: "760209360933",
    appId: "1:760209360933:web:4762befed45f3ca53d17cc"
};

//console.log("working!");

const app = initializeApp(firebaseConfig);

const db = getFirestore();

const colRef = collection(db, "bookmarks");

const addForm = document.querySelector(".add");
addForm.addEventListener("submit", event => {
    event.preventDefault();
    addDoc(colRef, {
        link: addForm.link.value,
        title: addForm.title.value,
        category: addForm.category.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addForm.reset();
        fetchData();
    });
    
});

const cards = document.querySelector(".bookmark-cards");
function fetchData(){
    cards.innerHTML = "";
    getDocs(colRef)
    .then(data => {
        data.docs.forEach(document => {
            let span = "";
            if(document.data().category === "youtube") span = '<span class="card-tag active" style="background-color: rgb(153, 0, 0);color:white;">Youtube</span>';
            else if(document.data().category === "netflix") span = '<span class="card-tag active" style="background-color: rgb(165, 11, 11);color:white;">Netflix</span>';
            else if(document.data().category === "twitter") span = '<span class="card-tag active" style="background-color: rgb(3, 129, 247);color:white;">Twitter</span>';
            else    span = '<span class="card-tag active" style="background-color: rgb(255, 174, 0);color:white;">Other</span>';

            const card = `<div class="card">
                            <div class="card-header">
                                <p class="card-title">${document.data().title}</p>
                            </div>
                            <div class="card-body">
                                <div>
                                    ${span}
                                </div>
                                <div class="functions">
                                    <i class="bi bi-box-arrow-up-right" style="color:#000000" onclick="window.open('${document.data().link}')"></i>
                                    <i class="bi bi-google" style="color:#1b6ae9" onclick="window.open('https://www.google.com/search?q=${document.data().title}')"></i>
                                    <i class="bi bi-trash" style="color:#f33838" data-id="${document.id}"></i>
                                </div>
                            </div>
                        </div>`;
            
            cards.innerHTML += card;
            
        });
    })
    .catch(error => {
        console.log(error);
    });
}

fetchData();