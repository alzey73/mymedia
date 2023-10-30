// upload.js
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("You are not logged in!");
        return;
    }

    const formData = new FormData(e.target);

    fetch('http://localhost:3000/api/userpages/upload', {
        method: 'POST',
        headers: {
            'x-auth-token': token
        },
        body: formData
    })
    .then(response =>{
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while uploading the file.');
    });
});
