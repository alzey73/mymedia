// upload.js
requireLogin();

document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    try {
        const data = await apiFetch('/api/userpages/upload', {
            method: 'POST',
            body: new FormData(e.target)
        });
        alert(data.message);
        e.target.reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Upload failed: ' + error.message);
    }
});
