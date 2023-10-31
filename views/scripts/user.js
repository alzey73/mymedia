document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Formun varsayılan gönderme işlemini engelle
    console.log("Form submitted!");


    const socket = io('http://localhost:3000');

    socket.on('connect', function () {
        console.log('Connected to the server.');
    });

    socket.on('disconnect', function (reason) {
        console.log('Disconnected from the server. Reason:', reason);
    });

    socket.on('reconnect_attempt', function () {
        console.log('Attempting to reconnect...');
    });


    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;



    fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })


    })
        .then(response => {
            if (!response.ok) {
                // Hata durumunda da JSON içeriği oku
                return response.json().then(err => { throw err; });
            }
            return response.json(); // This can also throw an error if not valid JSON!
        })
        .then(data => {
            document.getElementById('response').innerText = data.message;
            localStorage.setItem("token", data.token);
            //fetchUserFiles();
            window.location.href = 'userpage.html';
        })
        .catch(error => {
            //console.error('Error:', error);
            document.getElementById('response').innerText = 'Login failed. Error: ' + error.message;
        });
});

document.getElementById('createUserForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('createEmail').value;
    const password = document.getElementById('createPassword').value;


    fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
            .then(response => {
                if (!response.ok) {
                    // Eğer sunucudan hata yanıtı alındıysa, bu yanıtı JSON olarak dönüştür.
                    return response.json().then(err => { throw err; })
                }
                return response.json();
            })
            .then(data => {
                // Kullanıcı başarıyla oluşturulduysa, burada başarılı bir mesaj gösterebilirsiniz.
                alert("User created successfully!");
            })
            .catch(error => {
                // Eğer email adresi zaten varsa veya başka bir hata oluştuysa, burada hata mesajını gösterebilirsiniz.
                if (error.message) {
                    alert(error.message);
                } else {
                    alert("An error occurred while creating the user");
                }
            })
    });


