const session = requireLogin();
const userEmails = {}; // id -> email
let socket;

function appendMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const p = document.createElement('p');
    const senderName = message.sender === session.userId ? 'Ben' : (userEmails[message.sender] || message.sender);
    p.textContent = `${senderName}: ${message.text}`;
    messagesDiv.appendChild(p);
}

function selectedUserId() {
    return document.getElementById('userSelect').value;
}

async function fetchConversation() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.replaceChildren();
    const otherId = selectedUserId();
    if (!otherId) return;

    try {
        const messages = await apiFetch('/api/messagepage?with=' + encodeURIComponent(otherId));
        messages.forEach(appendMessage);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("ss").textContent = error.message;
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;
    const receiver = selectedUserId();

    if (messageText.trim() === '' || !receiver) return;

    socket.emit('sendMessage', { text: messageText, receiver }, (res) => {
        if (res && !res.ok) {
            document.getElementById("ss").textContent = res.error;
        }
    });

    messageInput.value = '';
}

async function fetchUsers() {
    try {
        const users = await apiFetch('/api/users');
        const userSelect = document.getElementById('userSelect');
        users.forEach(user => {
            userEmails[user._id] = user.email;
            if (user._id !== session.userId) {
                const option = document.createElement('option');
                option.value = user._id;
                option.textContent = user.email;
                userSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function connectSocket() {
    socket = io({ auth: { token: session.token } });

    socket.on('connect_error', (err) => {
        document.getElementById("ss").textContent = 'Connection error: ' + err.message;
    });

    socket.on('messageReceived', function (message) {
        // Sadece açık olan sohbete ait mesajları göster
        const otherId = selectedUserId();
        if (message.sender === otherId || message.receiver === otherId) {
            appendMessage(message);
        }
    });
}

if (session) {
    document.getElementById('userSelect').addEventListener('change', fetchConversation);
    document.getElementById('sendButton').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    connectSocket();
    fetchUsers().then(fetchConversation);
}
