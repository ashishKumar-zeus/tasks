

export class HandleApis {
    constructor(sheet) {
        this.init();
        this.sheet = sheet;
    }

    init() {
        this.tableName = null;
    }


    handleSignalR() {
        //establish connection
        this.signalRconnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5228/hubs/progressHub", {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect() // Automatically reconnect on failure
            .build();


        //start connection
        this.signalRconnection.start().catch(function (err) {
            return console.error(err.toString());
        });
        let amountOfSuccess = 0;
        //on receiving
        let j = 0;
        this.signalRconnection.on("ReceiveUpdate", function (message) {
            j++;
            console.log("Progress update: ", message, j);
            amountOfSuccess += 10;
            console.log("calling update")
            // this.updateProgressBar(amountOfSuccess);

            console.log("calaled")
            console.log(document.getElementById('progressBar').getAttribute('value'))

            document.getElementById('progressBar').setAttribute("value", amountOfSuccess)

        });

    }


    async uploadFile(formData) {

        document.getElementById('progressBar').style.display = 'block';


        let amountOfSuccess = 0;
        this.handleSignalR()


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


    async updateCellToBackend(rowInd, colInd, value) {

        console.log(this.sheet.headerCellsMaker.verticalArr[rowInd]);

        const email_id =this.sheet.headerCellsMaker.verticalArr[rowInd].next.data;

        const columnName = this.sheet.headerCellsMaker.horizontalArr[colInd].next.data;

        const data = {
            "email_id":email_id,
            "columnName":columnName,
            "value":value,
        }

        let response = await fetch(`http://localhost:5228/api/Data/UpdateRecord?record=${JSON.stringify(data)}`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: ""
            }
        );



    }
}