export class navFunctionalities {
    constructor(sheet) {
        this.sheet = sheet;
        this.init();
    }

    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        const fileInput = document.getElementById('uploadFileInput');
        if (fileInput) {
            fileInput.addEventListener('change', this.handleFileUpload.bind(this));
        }
    }

    async handleFileUpload(e) {
        e.preventDefault();
        const fileInput = e.target;
        const file = fileInput.files[0];

        if (file) {
            const formData = this.createFormData(file);

            try {
                await this.sheet.handleApis.uploadFile(formData);
                alert('File uploaded successfully.');
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Failed to upload file. Please try again.');
            }

        } else {
            alert('Please select a file to upload.');
        }
    }

    createFormData(file) {
        const formData = new FormData();
        formData.append('file', file);
        return formData;
    }
}
