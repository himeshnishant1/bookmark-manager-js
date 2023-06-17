import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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

let active_tag = "all";

const addForm = document.querySelector(".add");
addForm.addEventListener("submit", event => {
    event.preventDefault();
    if (addForm.link.value !== "" && addForm.title.value !== "") {
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
    }
});

const cards = document.querySelector(".bookmark-cards");

// Fetch Data from firebase.

function fetchData() {
    cards.innerHTML = "";
    getDocs(colRef)
        .then(data =>{
            setCard(data);
            setDeleteButtons();
        })
        .catch(error => {
            console.log(error);
        });
}

function setCard(data) {
    cards.innerHTML = "";
    data.docs.forEach(document => {
        let span = "";
        if (document.data().category === "youtube") span = '<span class="card-tag active" style="background-color: rgb(153, 0, 0);color:white;">Youtube</span>';
        else if (document.data().category === "netflix") span = '<span class="card-tag active" style="background-color: rgb(165, 11, 11);color:white;">Netflix</span>';
        else if (document.data().category === "twitter") span = '<span class="card-tag active" style="background-color: rgb(3, 129, 247);color:white;">Twitter</span>';
        else span = '<span class="card-tag active" style="background-color: rgb(255, 174, 0);color:white;">Other</span>';

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
                                    <i class="bi bi-trash delete" style="color:#f33838" data-id="${document.id}"></i>
                                </div>
                            </div>
                        </div>`;

        cards.innerHTML += card;

    });
}

fetchData();


//Delete Data
function setDeleteButtons() {
    const deleteButtons = document.querySelectorAll("i.delete");
    deleteButtons.forEach(button => {
        button.addEventListener('click', event => {
            const deleteRef = doc(db, "bookmarks", button.dataset.id);
            deleteDoc(deleteRef)
                .then(() => {
                    button.parentElement.parentElement.parentElement.remove();
                })
                .catch(error => {
                    console.log(error);
                });
        });
    });
}

const categoryList = document.querySelector(".tags");
categoryList.addEventListener('click', event => {
    if (event.target.tagName === "SPAN") {

        const children = categoryList.children;

        for (let i = 0; i < children.length; i++) {

            const child = children[i];

            if (child.classList[0] === active_tag) {
                child.classList.remove("active");
                active_tag = event.target.classList[0];
                event.target.classList.add("active");
            }
        }

        if (event.target.classList[0] === "all") {
            fetchData();
        }
        else {
            const qRef = query(colRef, where("category", "==", event.target.classList[0]));
            getDocs(qRef)
                .then(data =>{
                    setCard(data);
                    setDeleteButtons();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
});


