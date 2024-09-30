export class MinorFunctions {
    constructor(sheet) {
        this.sheet = sheet;
        this.ll = sheet.ll;
    }

    get_Min_Max_Avg_Sum_Count_OfArray(data) {
        let resultObj = this.processArray(data);
        if (resultObj.count > 1) {
            return resultObj;
        }
        return -1;
    }

    processArray(data) {
        let sum = 0;
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;
        let count = 0;

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {

                const value = parseFloat(data[i][j]);

                if ((!isNaN(value))) {
                    sum += value;
                    if (value < min) min = value;
                    if (value > max) max = value;
                    count++;
                }
            }
        }

        let avg = count === 0 ? 0 : sum / count;
        return { "min": min.toFixed(2), "max": max.toFixed(2), "avg": avg.toFixed(2), "sum": sum.toFixed(2), "count": count };
    }


    copyToClipboard2DArr(selectedCellsArray) {

        console.log(selectedCellsArray)

        // Convert the 2D array to a tab-separated string
        const arrayToClipboardString = selectedCellsArray.map(row => row.join('->')).join('\n');

        // Function to copy the string to the clipboard
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Data copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy data to clipboard', err);
            });
        }

        // Copy the string to the clipboard
        copyToClipboard(arrayToClipboardString);

    }


    deleteFromLinkedList(start, end) {
        // List to store the desired structure
        const batchDeleteArray = [];

        // Get start and end row/column indices
        let [rowStart, colStart, rowEnd, colEnd] = this.getRowColStartEnd(start, end);

        // Iterate through each row in the range
        for (let i = rowStart; i <= rowEnd; i++) {
            const email = this.getPrimaryKeyEmail(i); // Get the primary key email

            // Initialize an object for this row
            let rowObject = {
                email: email,
                columns: []
            };

            // Iterate through each column in the range
            for (let j = colStart; j <= colEnd; j++) {
                const columnName = this.getColumnNameFromInd(j); // Get the column name

                // Log the email and column name (for debugging as in your original code)
                console.log(email);
                console.log(columnName);

                // Delete the node in the linked list
                this.sheet.ll.deleteNode(i + 1, j + 1);

                // Add the column name and an empty value to the row object
                rowObject.columns.push({
                    columnName: columnName,
                    value: "" // Set value to empty string as per requirement
                });
            }

            // Add the row object to the batch delete array
            batchDeleteArray.push(rowObject);
        }

        console.log(batchDeleteArray)

        this.sheet.handleApis.bulkUpdateToBackend(batchDeleteArray);

        // Return the constructed list of dictionaries
        // return batchDeleteArray;
    }


    getRowColStartEnd(start, end) {

        let rowStart = Math.min(start.rowInd, end.rowInd);
        let colStart = Math.min(start.colInd, end.colInd);

        let rowEnd = Math.max(start.rowInd, end.rowInd);
        let colEnd = Math.max(start.colInd, end.colInd);

        return [rowStart, colStart, rowEnd, colEnd];
    }


    getPrimaryKeyEmail(rowInd) {
        // console.log(this.sheet.headerCellsMaker.verticalArr[rowInd].next.data);
        return (this.sheet.headerCellsMaker.verticalArr[rowInd].next.data)
    }

    getColumnNameFromInd(colInd) {
        // console.log(this.sheet.headerCellsMaker.horizontalArr[colInd].next.data);
        return (this.sheet.headerCellsMaker.horizontalArr[colInd].next.data);
    }

    // pasteToLinkedList(start, end, dataArr) {
    //     // this.deleteFromLinkedList(start, end);

    //     let [rowStart, colStart, rowEnd , colEnd] = this.getRowColStartEnd(start, end);


    //     for (let i = 0; (i < dataArr.length); i++) {
    //         console.log(this.getPrimaryKeyEmail(i+rowStart));
    //         for (let j = 0; (j < dataArr[i].length); j++) {
    //             console.log(this.getColumnNameFromInd(j+colStart));
    //             this.sheet.ll.setValueAtInd(i + rowStart, j + colStart, dataArr[i][j]);
    //         }
    //     }

    //     this.sheet.renderer.renderCanvas();
    //     this.sheet.functionality.updateInputPositionAndValue();
    // }
    pasteToLinkedList(start, end, dataArr) {
        // List to store the desired structure
        const batchUpdateArray = [];

        // Get start and end row/column indices
        let [rowStart, colStart, rowEnd, colEnd] = this.getRowColStartEnd(start, end);

        // Iterate through each row in the data array
        for (let i = 0; i < dataArr.length; i++) {
            const email = this.getPrimaryKeyEmail(i + rowStart); // Get the primary key email

            // Initialize an object for this row
            let rowObject = {
                email: email,
                columns: []
            };

            // Iterate through each column in the row
            for (let j = 0; j < dataArr[i].length; j++) {
                const columnName = this.getColumnNameFromInd(j + colStart); // Get the column name
                const value = dataArr[i][j]; // Get the value from the data array

                // Set the value in the linked list
                this.sheet.ll.setValueAtInd(i + rowStart, j + colStart, value);

                // Add the column name and value to the row object
                rowObject.columns.push({
                    columnName: columnName,
                    value: value
                });
            }

            // Add the row object to the batch update array
            batchUpdateArray.push(rowObject);
        }

        // Render and update input positions (as in your original code)
        this.sheet.renderer.renderCanvas();
        this.sheet.functionality.updateInputPositionAndValue();

        // console.log(batchUpdateArray);

        this.sheet.handleApis.bulkUpdateToBackend(batchUpdateArray);

    }



    async pasteClipboard(start, end) {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const dataArray = clipboardText.split('\n').map(row => row.trim().split('->'));
            this.pasteToLinkedList(start, end, dataArray)

        } catch (err) {
            console.error('Failed to read clipboard contents:', err);
        }
    }





}