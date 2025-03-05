# MessageTranslateFrontend

MessageTranslateFrontend is a chat application that allows users to send messages and automatically translate them into different languages using the Hugging Face API. It is built with HTML, JavaScript, and TailwindCSS for the frontend, and a backend in Node.js with Express and PostgreSQL.

## 🚀 Features

- 📩 Real-time message sending and receiving
- 🌎 Automatic message translation into different languages
- 🎨 Modern and responsive interface with TailwindCSS
- 🛠 Backend with Node.js, Express, and PostgreSQL
- 🔄 Automatic chat update every 5 seconds

## 🛠 Technologies Used

### Frontend:
- HTML, CSS (TailwindCSS)
- JavaScript (Fetch API for backend communication)

### Backend:
- Node.js with Express
- PostgreSQL for message storage
- Hugging Face API for automatic translation

## ⚡ Installation and Setup

1. *Clone the repository*
    bash
    git clone https://github.com/JuanBuitrago04/MessageTranslateFrontend.git
    cd MessageTranslateFrontend
    

2. *Install backend dependencies*
    bash
    cd backend
    npm install
    

3. *Set up the PostgreSQL database*
    - Make sure you have PostgreSQL installed and running.
    - Create a database:
      sql
      CREATE DATABASE message_translate;
      
    - Configure the PostgreSQL credentials in the backend (config.js or similar file).

4. *Run the backend*
    bash
    npm start
    
    By default, the server will run at [http://localhost:4000](http://localhost:4000).

5. *Run the frontend*
    - Open the index.html file in your browser or use an extension like Live Server in VS Code.

## 🌍 Using the Hugging Face API

The application uses the Hugging Face API for message translation. If you want to use your own API key, sign up at Hugging Face and get your key to replace it in the backend.

## 📌 Additional Notes

- Does not include voice recognition.
- Messages are stored in PostgreSQL.
- You can customize the styles in styles.css and improve the UI as needed.

## 📧 Contact

If you have any questions or suggestions, you can contact me at juancamilobuitragohernandez13@gmail.com.

🚀 Thank you for visiting this project! If you like it, don't forget to leave a ⭐ on the repository. 😃
