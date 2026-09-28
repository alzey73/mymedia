document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Formun varsayılan gönderme işlemini engelle

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/users/login', {
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
            return response.json();
        })
        .then(data => {
            document.getElementById('response').textContent = data.message;
            localStorage.setItem("token", data.token);
            window.location.href = 'userpage.html';
        })
        .catch(error => {
            document.getElementById('response').textContent = 'Login failed. Error: ' + error.message;
        });
});

document.getElementById('createUserForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('createEmail').value;
    const password = document.getElementById('createPassword').value;

    fetch('/api/users', {
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
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(() => {
            alert("User created successfully!");
            e.target.reset();
        })
        .catch(error => {
            // Eğer email adresi zaten varsa veya başka bir hata oluştuysa, burada hata mesajını gösterebilirsiniz.
            alert(error.message || "An error occurred while creating the user");
        });
});
