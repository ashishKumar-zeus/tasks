

export class HandleApis {
    constructor(sheet) {
        this.init();
        this.sheet = sheet;
    }

    init() {
        this.tableName = "usertest2";
        this.getDataInRange(0, 2000);

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

            // if(amountOfSuccess == 100){
            //     document.getElementById('progressBarContainer').style.display = 'none'
            // }

            console.log("calaled")
            console.log(document.getElementById('progressBar').getAttribute('value'))
            document.getElementById('progressBar').setAttribute("value", amountOfSuccess)
            document.getElementById('pBarLabel').innerHTML = `${amountOfSuccess} %`

        });

    }


    async uploadFile(formData) {
        document.getElementById('progressBarContainer').style.display = 'block';


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
            // console.log(data);

            this.sheet.ll.insertMultipleDataInLL(data, startInd);
        } catch (error) {
            console.error('Error:', error.message || error);
        }

    }


    async updateCellToBackend(rowInd, colInd, value) {

        // console.log(this.sheet.headerCellsMaker.verticalArr[rowInd]);

        if (!this.sheet.headerCellsMaker.verticalArr[rowInd].next) {
            return;
        }

        const rowId = this.sheet.headerCellsMaker.verticalArr[rowInd].next.data;

        const columnName = this.sheet.headerCellsMaker.horizontalArr[colInd].next.data;

        const data = {
            "rowId": rowId,
            "columnName": columnName,
            "value": value,
        }


        if (!this.tableName) {
            return;
        }

        console.log("sending request to backend")
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


    async bulkUpdateToBackend(batchUpdateArray) {

        // console.log(this.sheet.headerCellsMaker.verticalArr[rowInd]);

        if (!this.tableName) {
            return;
        }

        console.log("sending request to backend")
        let response = await fetch(`http://localhost:5228/api/Data/UpdateRecordsBatch`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(batchUpdateArray)
            }
        );



    }


    async search(query) {

        console.log("getting search result")

        if (!this.tableName) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:5228/api/Data/FindRow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(query)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error:', error.message || error);
        }
    }



    async deleteRows(rowIds) {
        try {
            const response = await fetch('http://localhost:5228/api/Data/DeleteRows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rowIds)
            });
            const result = await response.json();

            if (result) {
                console.log('Rows deleted successfully');
                // delete from linked list too 
            } else {
                console.error('Failed to delete rows');
            }
        } catch (error) {
            console.error('Error deleting rows:', error);
        }
    }

    async  insertRows(startInd, numberOfRows) {
    const requestBody = {
        StartInd: startInd,
        NumberOfRows: numberOfRows
    };

    try {
        const response = await fetch('http://localhost:5228/api/Data/InsertRows', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result) {
            console.log('Rows inserted successfully');
        } else {
            console.log('Failed to insert rows');
        }
    } catch (error) {
        console.error('Error inserting rows:', error);
    }
}
    




}