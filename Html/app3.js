
function fetchUserFiles() {
    console.log("fetchUserFiles function is called");
    const token = localStorage.getItem("token");
    fetch('http://localhost:3000/api/userpages/userpage', {
        method: 'GET',
        headers: {
            //'Authorization': 'Bearer ' + token
            'x-auth-token': token
        }

        
    })
    .then(response => {
        // Yanıt başarılı değilse hata fırlat
        console.log("Response received:", response);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        
        return response.json();
    })
    .then(data => {
        console.log("Data received from server:", data);
        // Eğer data içerisinde bir message varsa, bu mesajı #ss elementine yazdır
        if (data.message) {
            document.getElementById("ss").innerText = data.message;
        }

        // Eğer data içerisinde dosyalar varsa, bu dosyaları #userData elementine yazdır
        const filesData = data; // data'nın ilk elemanını al
        console.log("data files :",filesData);
        console.log("data lenght :",data.length);
        if (filesData && filesData.length > 0) {
            //console.log("data files :",data.files);
            
            const filesDiv = document.getElementById('userData');
            filesData.forEach(file => {
                if (file.type === "video") {
                    filesDiv.innerHTML += `
                        <h3>${file.description}</h3>
                        <video width="320" height="240" controls>
                            <source src="${file.path}" type="video/mp4">
                            Tarayıcınız video etiketini desteklemiyor.
                        </video>
                    `;
                } else if (file.type === "image") {
                    // Eğer dosya tipi resimse, burada resim gösterimi için kodları ekleyebilirsiniz.
                } else {
                    // Diğer dosya tipleri için burada kodları ekleyebilirsiniz.
                }
            });
            
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("ss").innerText = error.message;
    });
}

// Sayfa yüklendiğinde çalışacak fonksiyon
window.onload = function() {
    // localStorage'dan token'ı al
    const token = localStorage.getItem("token");
    
    // Konsola token'ı yazdır
   // console.log("Token:", token);
    
    // ... diğer işlemleriniz
}




fetchUserFiles();