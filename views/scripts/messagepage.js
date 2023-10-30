const socket = io('http://localhost:3000');

socket.on('connect', function() {
    console.log('Bağlandı:', socket.id);
    // Kullanıcı listesini almak için bir istek yapabilirsiniz.
    // Örneğin: fetch('/api/users').then(...)
    // Dönen kullanıcı listesi ile #userList'i doldurabilirsiniz.
});

socket.on('messageReceived', function(message) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p>${message.sender}: ${message.text}</p>`;
});
function fetchUserMessages() {
    console.log("fetchUserMessages function is called");
    const token = localStorage.getItem("token");
    fetch('http://localhost:3000/api/messagepage', {  // API endpoint'inizi buraya yazın
        method: 'GET',
        headers: {
            'x-auth-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data received from server:", data);
        const messagesData = data;
        if (messagesData && messagesData.length > 0) {
            const messagesDiv = document.getElementById('messages');
            messagesData.forEach(message => {
                messagesDiv.innerHTML += `<p>${message.sender}: ${message.text}</p>`;
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("ss").innerText = error.message;
    });
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;
    if (messageText.trim() === '') return;

    socket.emit('sendMessage', {
        text: messageText,
        receiver: 'Alıcının_IDsi' // Bu kısmı dinamik olarak seçilen kullanıcıya göre ayarlamalısınız.
    });

    messageInput.value = '';
}

window.onload = function() {
    fetchUserMessages();
}