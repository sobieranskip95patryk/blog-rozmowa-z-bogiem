// Importujemy funkcje z SDK Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { firebaseConfig } from "./config.js";

// Inicjalizacja Firebase
let app, db, analytics;
try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    analytics = getAnalytics(app);
} catch (error) {
    console.error("Błąd inicjalizacji Firebase.", error);
}

// Elementy DOM
const messageList = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('admin-pass');
const sendBtn = document.getElementById('send-btn');

// Hasło Admina (proste zabezpieczenie po stronie klienta - w wersji produkcyjnej powinno być po stronie serwera/Firebase Rules)
const GOD_PASSWORD = "amen"; 

// Funkcja dodająca wiadomość do HTML
function addMessageToUI(name, text, role) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    
    if (role === 'god') {
        msgDiv.classList.add('msg-god');
    } else {
        msgDiv.classList.add('msg-user');
    }

    const header = document.createElement('div');
    header.classList.add('msg-header');
    header.textContent = role === 'god' ? 'Bóg' : name;

    const content = document.createElement('div');
    content.textContent = text;

    msgDiv.appendChild(header);
    msgDiv.appendChild(content);
    
    messageList.appendChild(msgDiv);
    messageList.scrollTop = messageList.scrollHeight; // Przewiń na dół
}

// Funkcja wysyłania wiadomości
function sendMessage() {
    const text = messageInput.value.trim();
    const name = usernameInput.value.trim() || "Anonim";
    const password = passwordInput.value.trim();
    
    if (text === "") return;

    // Sprawdź czy to admin
    let role = 'user';
    let deployName = name;

    if (password === GOD_PASSWORD) {
        role = 'god';
        deployName = 'Bóg';
    }

    if (db) {
        // Wyślij do Firebase
        const messagesRef = ref(db, 'messages');
        push(messagesRef, {
            name: deployName,
            text: text,
            role: role,
            timestamp: Date.now()
        });
    } else {
        // Fallback jeśli Firebase nie działa (tylko lokalnie)
        addMessageToUI(deployName, text, role);
        alert("Wiadomość widoczna tylko lokalnie (brak konfiguracji Firebase).");
    }

    messageInput.value = "";
}

// Nasłuchiwanie na nowe wiadomości z Firebase
if (db) {
    const messagesRef = ref(db, 'messages');
    onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val();
        addMessageToUI(data.name, data.text, data.role);
    });
}

// Obsługa przycisku i entera
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});