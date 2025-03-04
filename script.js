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
    const limpiarChatBtn = document.getElementById('limpiar-chat');
  
    let sender = '';
  
    // Función para agregar un mensaje al chat
    function agregarMensaje(mensaje, tipo) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'flex items-start ' + (tipo === 'user' ? 'justify-end' : 'justify-start');
        
        const burbuja = document.createElement('div');
        burbuja.className = tipo === 'user' 
            ? 'bg-indigo-600 text-white rounded-2xl p-4 max-w-xs sm:max-w-md'
            : 'bg-gray-100 rounded-2xl p-4 max-w-xs sm:max-w-md';
        
        const texto = document.createElement('p');
        texto.className = 'text-sm';
        texto.textContent = mensaje;
        
        burbuja.appendChild(texto);
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
            if (!response.ok) {
                throw new Error("Error al obtener mensajes: " + response.statusText);
            }
            const mensajes = await response.json();
            
            if (!Array.isArray(mensajes)) {
                throw new Error("La respuesta no es un arreglo");
            }
  
            chatContainer.innerHTML = '';
            mensajes.reverse().forEach(msg => {
                agregarMensaje(`${msg.sender}: ${msg.message}`, 'user');
                agregarMensaje(`Traducción: ${msg.translated} (${msg.language})`, 'system');
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
                    sender: sender || 'Usuario', 
                    message: mensaje, 
                    targetLang: idiomaDestino.value  
                })
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error desconocido al enviar mensaje");
            }
            
            mensajeInput.value = '';
            actualizarChat();
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            mostrarError("Error al enviar mensaje: " + error.message);
        }
    });
    
    // Evento para limpiar el chat
    limpiarChatBtn.addEventListener('click', async function () {
        try {
            await fetch('https://messagetranslate.onrender.com/messages', { method: 'DELETE' });
            chatContainer.innerHTML = '';
        } catch (error) {
            console.error("Error al limpiar el chat:", error);
            mostrarError("Error al limpiar el chat: " + error.message);
        }
    });
    
    // Cerrar la ventana emergente de error
    closeModal.addEventListener('click', () => {
        errorModal.classList.add('hidden');
    });
  
    // Manejar la ventana emergente de solicitud de nombre
    submitName.addEventListener('click', () => {
        sender = nameInput.value.trim() || 'Usuario';
        nameModal.classList.add('hidden');
    });
  
    nameModal.classList.remove('hidden');
  
    // Cargar mensajes al inicio y cada 5 segundos
    actualizarChat();
    setInterval(actualizarChat, 5000);
});
