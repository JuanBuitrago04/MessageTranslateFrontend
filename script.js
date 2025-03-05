document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formulario');
    const messageInput = document.getElementById('mensaje');
    const chatContainer = document.getElementById('chat');
    const sourceLanguage = document.getElementById('idioma-origen');
    const targetLanguage = document.getElementById('idioma-destino');
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    const closeModal = document.getElementById('close-modal');
    const nameModal = document.getElementById('name-modal');
    const nameInput = document.getElementById('name-input');
    const submitName = document.getElementById('submit-name');
    const clearChat = document.getElementById('limpiar-chat');
    const confirmDeleteModal = document.getElementById('confirm-delete-modal');
    const cancelDelete = document.getElementById('cancel-delete');
    const confirmDelete = document.getElementById('confirm-delete');
  
    let sender = '';

    // Function to add a message to the chat
    function addMessage(message, type, timestamp, sender) {
        const messageDiv = document.createElement('div');
        // 'user' for user messages, 'system' for translated or system messages
        messageDiv.className = 'flex items-start ' + (type === 'user' ? 'justify-end' : 'justify-start');
        
        const bubble = document.createElement('div');
        bubble.className = type === 'user' 
            ? 'text-white rounded-2xl p-4 max-w-xs sm:max-w-md message-out'
            : type === 'system'
            ? 'text-white rounded-2xl p-4 max-w-xs sm:max-w-md message-translated'
            : 'bg-gray-100 rounded-2xl p-4 max-w-xs sm:max-w-md message-in';
        
        const text = document.createElement('p');
        text.className = 'text-sm';
        text.textContent = message;
        
        const time = document.createElement('span');
        time.className = 'text-xs timestamp';
        time.textContent = new Date(timestamp).toLocaleString();
        
        bubble.appendChild(text);
        bubble.appendChild(time);
        messageDiv.appendChild(bubble);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Function to show the error modal
    function showError(message) {
        errorMessage.textContent = message;
        errorModal.classList.remove('hidden');
    }
  
    // Function to update the chat (GET request to the backend)
    async function updateChat() {
        try {
            const response = await fetch('https://messagetranslate.onrender.com/messages');
            const messages = await response.json();
            if (!Array.isArray(messages)) {
                throw new Error("The response is not an array");
            }
            // Clear the chat
            chatContainer.innerHTML = '';
            // If messages come in descending order, reverse the array to show the oldest first
            messages.reverse().forEach(msg => {
                // Show the original message with the user's selected color
                addMessage(`${msg.sender}: ${msg.message}`, 'user', msg.timestamp, msg.sender, msg.color);
                // Show the translation
                addMessage(`Translation: ${msg.translated} (${msg.language})`, 'system', msg.timestamp, msg.sender);
            });
        } catch (error) {
            console.error("Error getting messages:", error);
            showError("Error getting messages: " + error.message);
        }
    }
    
    // Event to send a message (POST request to the backend)
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message === '') return;
        
        try {
            const response = await fetch('https://messagetranslate.onrender.com/messages', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    sender,              // user's name
                    message,             // message in Spanish
                    sourceLang: sourceLanguage.value,  // source language code
                    targetLang: targetLanguage.value,  // target language code
                })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("Error sending message:", data.error);
                showError("Error sending message: " + data.error);
            } else {
                // Update the chat after sending the message
                updateChat();
            }
        } catch (error) {
            console.error("Error sending message:", error);
            showError("Error sending message: " + error.message);
        }
        messageInput.value = '';
    });
    
    // Close the error modal
    closeModal.addEventListener('click', () => {
        errorModal.classList.add('hidden');
    });
  
    // Handle the name prompt modal
    submitName.addEventListener('click', () => {
        sender = nameInput.value.trim();
        if (sender === '') {
            sender = 'User';
        }
        nameModal.classList.add('hidden');
    });

    // Show the confirm delete modal
    clearChat.addEventListener('click', () => {
        confirmDeleteModal.classList.remove('hidden');
    });

    // Cancel chat deletion
    cancelDelete.addEventListener('click', () => {
        confirmDeleteModal.classList.add('hidden');
    });

    // Confirm chat deletion
    confirmDelete.addEventListener('click', async function() {
        try {
            const response = await fetch('https://messagetranslate.onrender.com/messages', {
                method: 'DELETE'
            });
            if (!response.ok) {
                const data = await response.json();
                console.error("Error clearing chat:", data.error);
                showError("Error clearing chat: " + data.error);
            } else {
                // Clear the chat in the frontend
                chatContainer.innerHTML = '';
                confirmDeleteModal.classList.add('hidden');
            }
        } catch (error) {
            console.error("Error clearing chat:", error);
            showError("Error clearing chat: " + error.message);
        }
    });
  
    // Update the chat every 5 seconds
    setInterval(updateChat, 5000);
    // Initial call to load messages
    updateChat();
});