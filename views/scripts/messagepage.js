const socket = io('http://localhost:3000');

socket.on('connect', function () {
    console.log('Bağlandı:', socket.id);
    // Kullanıcı listesini almak için bir istek yapabilirsiniz.
    // Örneğin: fetch('/api/users').then(...)
    // Dönen kullanıcı listesi ile #userList'i doldurabilirsiniz.
});

socket.on('messageReceived', function (message) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p>${message.sender}: ${message.text}</p>`;
});
function fetchUserMessages() {
    console.log("fetchUserMessages function is called");
    console.log("w");
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
            console.log("message", messagesData);
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
    console.log("ww");
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token);
    const currentUserId = decodedToken.userId;

    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;
    const userSelect = document.getElementById('userSelect');
    const selectedUserId = userSelect.value;
    console.log("www");
    if (messageText.trim() === '') return;

    fetch("http://localhost:3000/api/messagepage/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
        },
        body: JSON.stringify({
            text: messageText,
            sender: currentUserId,
            receiver: selectedUserId
        })

       
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Message sending failed " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Tmessage sent: ",data)
            messageInput.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("ss").innerText = error.message;
        });
}

function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (e) {
        console.error('Token decode error:', e);
        return null;
    }
}

function fetchUsers() {

    const token2 = localStorage.getItem('token');
    const decodedToken = decodeToken(token2);
    const currentUserId = decodedToken.userId;
    console.log("w");
    fetch('http://localhost:3000/api/users')
        .then(response => response.json())
        .then(users => {
            const userSelect = document.getElementById('userSelect');
            users.forEach(user => {
                if (user._id !== currentUserId) {
                    const option = document.createElement('option');
                    option.value = user._id; // Kullanıcının ID'si
                    console.log(option.value);
                    option.textContent = user.email; // Kullanıcının email adresi veya diğer bir bilgisi
                    userSelect.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
}



window.onload = function () {
    fetchUserMessages();
    fetchUsers();
}