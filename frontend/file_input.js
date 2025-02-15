const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const downloadButton = document.getElementById('downloadButton');
const errorMessage = document.getElementById('errorMessage');

function validateFileType(file) {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
    ];
    return file && allowedTypes.includes(file.type);
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

function uploadFile(file) {
    const formData = new FormData();
    formData.append('uploaded_file', file);

    fetch('/upload', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                downloadButton.style.display = 'inline-block';
            } else {
                showError("File upload failed.");
            }
        })
        .catch(() => showError("An error occurred while uploading."));
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

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    for (const file of files) {
        if (validateFileType(file)) {
            uploadFile(file);
        } else {
            showError('Only .docx, .pptx, and .pdf files are accepted.');
        }
    }
});

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    for (const file of files) {
        if (validateFileType(file)) {
            uploadFile(file);
        } else {
            showError('Only .docx, .pptx, and .pdf files are accepted.');
        }
    }
});
