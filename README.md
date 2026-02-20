# Rozmowa z Bogiem - Blog & Czat

Projekt strony internetowej umożliwiającej użytkownikom prowadzenie wirtualnej rozmowy z "Bogiem". Aplikacja zawiera prosty czat czasu rzeczywistego, gdzie użytkownicy mogą zadawać pytania, a administrator (Bóg) udziela na nie odpowiedzi.

![Podgląd strony](imagines/rozmowa%20z%20bogiem.png)

## 🌟 Funkcjonalności

*   **Czat na żywo:** Wiadomości pojawiają się natychmiast u wszystkich użytkowników dzięki integracji z Firebase Realtime Database.
*   **Tryb Administratora (Boga):** Administrator może odpisywać jako "Bóg" (wiadomości wyróżnione złotym kolorem po prawej stronie).
*   **Responsywność (RWD):** Strona dostosowana do urządzeń mobilnych i desktopowych.
*   **Estetyczny design:** Ciemny motyw, stylizowany na "mistyczny".

## 🛠️ Technologie

*   HTML5
*   CSS3 (Flexbox, RWD)
*   JavaScript (ES6+)
*   Firebase (Realtime Database)

## 🚀 Jak uruchomić projekt

1.  Sklonuj repozytorium:
    ```bash
    git clone https://github.com/sobieranskip95patryk/blog-rozmowa-z-bogiem.git
    ```
2.  Otwórz plik `index.html` w przeglądarce.

### ⚠️ Konfiguracja Firebase (Wymagane!)

Aby czat działał poprawnie, musisz skonfigurować własną bazę danych Firebase:

1.  Zaloguj się na [Firebase Console](https://console.firebase.google.com/).
2.  Utwórz nowy projekt.
3.  W sekcji **Build** wybierz **Realtime Database** i utwórz bazę danych.
4.  W ustawieniach projektu (Project Settings) znajdź sekcję "Your apps" i wybierz ikonę Web (`</>`).
5.  Zarejestruj aplikację i skopiuj obiekt `firebaseConfig`.
6.  Wklej skopiowane dane do pliku `script.js` w miejscu oznaczonym komentarzem:
    ```javascript
    const firebaseConfig = {
        apiKey: "TWOJE_DANE",
        authDomain: "TWOJE_DANE",
        // ...
    };
    ```

## 🔐 Tryb Administratora

Aby wysłać wiadomość jako "Bóg":
1.  W dolnym panelu czatu, w polu "Hasło (dla Boga)" wpisz hasło administratora.
2.  Domyślne hasło w kodzie to: **amen** (możesz je zmienić w pliku `script.js` w zmiennej `GOD_PASSWORD`).
3.  Napisz wiadomość i kliknij "Wyślij". Wiadomość pojawi się po prawej stronie w kolorze złotym.

## 📄 Licencja

Projekt stworzony w celach edukacyjnych/rozrywkowych.
