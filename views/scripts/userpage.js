function renderFile(file) {
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-4';

    const title = document.createElement('h3');
    title.textContent = file.description || '';
    wrapper.appendChild(title);

    let media;
    if (file.type === "video") {
        media = document.createElement('video');
        media.controls = true;
        media.width = 320;
        media.height = 240;
        media.src = file.path;
    } else if (file.type === "image") {
        media = document.createElement('img');
        media.style.maxWidth = '320px';
        media.alt = file.description || '';
        media.src = file.path;
    } else {
        return null;
    }
    wrapper.appendChild(media);
    return wrapper;
}

async function fetchUserFiles() {
    const status = document.getElementById("ss");
    try {
        const files = await apiFetch('/api/userpages/userpage');
        const filesDiv = document.getElementById('userData');

        if (files.length === 0) {
            status.textContent = "No files found for this user.";
            return;
        }
        files.forEach(file => {
            const el = renderFile(file);
            if (el) filesDiv.appendChild(el);
        });
    } catch (error) {
        console.error('Error:', error);
        status.textContent = error.message;
    }
}

if (requireLogin()) {
    fetchUserFiles();
}
