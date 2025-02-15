const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const downloadButton = document.getElementById('downloadButton');

function validateFileType(file) {
    if (!file) return false;

    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    return allowedTypes.includes(file.type);
}

function uploadFile(file) {
    const formData = new FormData();
    formData.append('pdf_file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            downloadButton.style.display = 'inline-block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function downloadWordDoc() {
    window.location.href = '/download_word';
}

dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');

    const file = e.dataTransfer.files[0];

    if (validateFileType(file)) {
        uploadFile(file);
    } else {
        console.log('Only .docx, .pptx. and .pdf files are accepted.');
    }

});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        uploadFile(file);
    } else {
        console.log("Only PDF files are accepted.");
    }
});