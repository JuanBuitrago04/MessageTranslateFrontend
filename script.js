document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    const mensajeInput = document.getElementById('mensaje');
    const chatContainer = document.getElementById('chat');
    const idiomaOrigen = document.getElementById('idioma-origen');
    const idiomaDestino = document.getElementById('idioma-destino');
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    const closeModal = document.getElementById('close-modal');
    const nameModal = document.getElementById('name-modal');
    const nameInput = document.getElementById('name-input');
    const submitName = document.getElementById('submit-name');
    const limpiarChat = document.getElementById('limpiar-chat');
    const confirmDeleteModal = document.getElementById('confirm-delete-modal');
    const cancelDelete = document.getElementById('cancel-delete');
    const confirmDelete = document.getElementById('confirm-delete');
  
    let sender = '';

    // Función para agregar un mensaje al chat
    function agregarMensaje(mensaje, tipo, timestamp, sender) {
        const mensajeDiv = document.createElement('div');
        // 'user' para mensajes del usuario, 'system' para mensajes traducidos o del sistema
        mensajeDiv.className = 'flex items-start ' + (tipo === 'user' ? 'justify-end' : 'justify-start');
        
        const burbuja = document.createElement('div');
        burbuja.className = tipo === 'user' 
            ? 'text-white rounded-2xl p-4 max-w-xs sm:max-w-md message-out'
            : tipo === 'system'
            ? 'text-white rounded-2xl p-4 max-w-xs sm:max-w-md message-translated'
            : 'bg-gray-100 rounded-2xl p-4 max-w-xs sm:max-w-md message-in';
        
        const texto = document.createElement('p');
        texto.className = 'text-sm';
        texto.textContent = mensaje;
        
        const time = document.createElement('span');
        time.className = 'text-xs timestamp';
        time.textContent = new Date(timestamp).toLocaleString();
        
        burbuja.appendChild(texto);
        burbuja.appendChild(time);
        mensajeDiv.appendChild(burbuja);
        chatContainer.appendChild(mensajeDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Función para mostrar la ventana emergente de error
    function mostrarError(mensaje) {
        errorMessage.textContent = mensaje;
        errorModal.classList.remove('hidden');
    }
  
    // Función para actualizar el chat (llamada GET al backend)
    async function actualizarChat() {
        try {
            const response = await fetch('https://messagetranslate.onrender.com/messages');
            const mensajes = await response.json();
            if (!Array.isArray(mensajes)) {
                throw new Error("La respuesta no es un arreglo");
            }
            // Limpia el chat
            chatContainer.innerHTML = '';
            // Si los mensajes vienen en orden descendente, invierte el arreglo para mostrar el más antiguo primero
            mensajes.reverse().forEach(msg => {
                // Muestra el mensaje original con el color seleccionado por el usuario
                agregarMensaje(`${msg.sender}: ${msg.message}`, 'user', msg.timestamp, msg.sender, msg.color);
                // Muestra la traducción
                agregarMensaje(`Traducción: ${msg.translated} (${msg.language})`, 'system', msg.timestamp, msg.sender);
            });
        } catch (error) {
            console.error("Error al obtener mensajes:", error);
            mostrarError("Error al obtener mensajes: " + error.message);
        }
    }
    
    // Evento para enviar mensaje (llamada POST al backend)
    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();
        const mensaje = mensajeInput.value.trim();
        if (mensaje === '') return;
        
        try {
            const response = await fetch('https://messagetranslate.onrender.com/messages', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    sender,              // nombre del usuario
                    message: mensaje,    // mensaje en español
                    sourceLang: idiomaOrigen.value,  // código del idioma origen
                    targetLang: idiomaDestino.value,  // código del idioma destino
                })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("Error al enviar mensaje:", data.error);
                mostrarError("Error al enviar mensaje: " + data.error);
            } else {
                // Actualiza el chat luego de enviar el mensaje
                actualizarChat();
            }
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            mostrarError("Error al enviar mensaje: " + error.message);
        }
        mensajeInput.value = '';
    });
    
    // Cerrar la ventana emergente de error
    closeModal.addEventListener('click', () => {
        errorModal.classList.add('hidden');
    });
  
    // Manejar la ventana emergente de solicitud de nombre
    submitName.addEventListener('click', () => {
        sender = nameInput.value.trim();
        if (sender === '') {
            sender = 'Usuario';
        }
        nameModal.classList.add('hidden');
    });

    // Mostrar el modal de confirmación de eliminación
    limpiarChat.addEventListener('click', () => {
        confirmDeleteModal.classList.remove('hidden');
    });

    // Cancelar la eliminación del chat
    cancelDelete.addEventListener('click', () => {
        confirmDeleteModal.classList.add('hidden');
    });

    // Confirmar la eliminación del chat
    confirmDelete.addEventListener('click', async function() {
        try {
            const response = await fetch('https://messagetranslate.onrender.com/messages', {
                method: 'DELETE'
            });
            if (!response.ok) {
                const data = await response.json();
                console.error("Error al limpiar el chat:", data.error);
                mostrarError("Error al limpiar el chat: " + data.error);
            } else {
                // Limpia el chat en el frontend
                chatContainer.innerHTML = '';
                confirmDeleteModal.classList.add('hidden');
            }
        } catch (error) {
            console.error("Error al limpiar el chat:", error);
            mostrarError("Error al limpiar el chat: " + error.message);
        }
    });
  
    // Actualiza el chat cada 5 segundos
    setInterval(actualizarChat, 5000);
    // Llamada inicial para cargar mensajes
    actualizarChat();
});