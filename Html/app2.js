document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Formun varsayılan gönderme işlemini engelle
    console.log("Form submitted!");
    
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
            localStorage.setItem("token",data.token);
            //fetchUserFiles();
            window.location.href = 'userpage.html';
        })
        .catch(error => {
            //console.error('Error:', error);
            document.getElementById('response').innerText = 'Login failed. Error: ' + error.message;
        });
});
