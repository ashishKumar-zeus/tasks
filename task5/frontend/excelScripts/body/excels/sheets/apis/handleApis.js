

export class HandleApis {
    constructor(sheet) {
        this.init();
        this.sheet = sheet;
    }

    init() {
        this.tableName = null;
    }


    updateProgressBar(amt){
        document.getElementById('progressBar').value = amt;
        console.log(document.getElementById('progressBar').value)
    }

    async uploadFile(formData) {

        document.getElementById('progressBar').style.display = 'block';


        let amountOfSuccess = 0;
        
        const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5228/hubs/progressHub", {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect() // Automatically reconnect on failure
        .build();

        let j=0;
        connection.on("ReceiveUpdate", function (message) {
            j++;
            console.log("Progress update: ", message,j);
            amountOfSuccess+=10;
            this.updateProgressBar(amountOfSuccess);
        });

        connection.start().catch(function (err) {
            return console.error(err.toString());
        });


        const res = await fetch('http://localhost:5228/api/Data/insertMultipleData6', {
            method: 'POST',
            body: formData,
        })

        if (res) {
            this.tableName = 'usertest2';
            this.getDataInRange(0, 2000);
            this.sheet.renderor.renderCanvas();
        }
    }

    async getDataInRange(startInd, limit) {

        console.log("getting data")

        if (!this.tableName) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:5228/api/Data/getDataInRange?start=${startInd}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain'
                }
            });
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            console.log(data);
        
            this.sheet.ll.insertMultipleDataInLL(data, startInd);
        } catch (error) {
            console.error('Error:', error.message || error);
        }
        
    }
}