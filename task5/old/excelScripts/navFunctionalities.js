export class navFunctionalities{

    constructor(sheet){
        this.init();
        this.sheet = sheet;
    }

    init(){
        // this.handleEvents();
    }
    
    async handleFileUpload(e) {
    
        e.preventDefault();
        console.log("uploaded file");

        const fileInput = document.getElementById('uploadFileInput');
        const file = fileInput.files[0];

        if (file) {

            // console.log("file found");
            const formData = new FormData();
            formData.append('file', file);

            await fetch('http://localhost:5228/api/Data/insertMultipleData6', {
                method: 'POST',
                body: formData,
            })
                .then(async (response) =>response.json())
                .then((data)=>{
                    console.log(data);
                    // console.log("to be inserted in sheet instance ",this.sheet);
                    this.sheet.ll.insertMultipleDataInLL(data);
                    this.sheet.renderor.renderCanvas();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            alert('Please select a file to upload.');
        }


    }


}