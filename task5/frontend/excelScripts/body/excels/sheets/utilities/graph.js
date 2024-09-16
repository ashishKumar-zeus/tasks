

export class Graph {

    constructor(sheet) {

        this.sheet = sheet;
        //getting graph buttons


        this.graphCanvas = document.getElementById(`graphCanvas_${this.sheet.id}`);
        this.graph = document.getElementById(`graph_${this.sheet.id}`)

        this.barGraphBtn = document.getElementById("barGraphBtn")
        this.pieGraphBtn = document.getElementById("pieGraphBtn")
        this.lineGraphBtn = document.getElementById("lineGraphBtn")
        this.graphCloseBtn = document.querySelector(`#graphCloseBtn_${this.sheet.id}`);

        this.selectedCells = [];
        this.startSelectionIndex = null;
        this.endSelectionIndex = null;

        this.isDragging = false;


        // Initialize event listeners
        this.init();
    } 

    // Initialize event listeners for graph buttons
    init() {
        this.barGraphBtn.addEventListener("click", () => {
            this.graph.style.display = "inline-block";
            this.drawBarGraph();
        });

        this.lineGraphBtn.addEventListener("click", () => {
            this.graph.style.display = "inline-block";
            this.drawLineGraph();
        });

        this.pieGraphBtn.addEventListener("click", () => {
            this.graph.style.display = "inline-block";
            this.drawPieGraph();
        });

        this.graphCloseBtn.addEventListener("click", () => {
            this.graph.style.display = "none";
        });

        this.handleEvents()
    }

    destroyGraph() {
        if (this.draw) {
            this.draw.destroy();
        }
    }


    getColName(n) {
        let columnName = '';
        while (n > 0) {
            let remainder = (n - 1) % 26;
            columnName = String.fromCharCode(65 + remainder) + columnName;
            n = Math.floor((n - 1) / 26);
        }
        return columnName;

    }


    getGraphValue() {
        let xValues = [];
        let dataSets = [];


        // Determine if the horizontal size is larger
        const isHorizontalLarger = this.isHorizontalSizeBigger();

        [this.startSelectionIndex, this.endSelectionIndex] = this.sheet.functionality.getStartIndexEndIndex();

        let startRowInd = this.startSelectionIndex.rowInd;
        let startColInd = this.startSelectionIndex.colInd;
        let endRowInd = this.endSelectionIndex.rowInd;
        let endColInd = this.endSelectionIndex.colInd;


        console.log(startRowInd, startColInd, endRowInd, endColInd)

        if (isHorizontalLarger) {


            let rowNum = startRowInd + 1;
            // Iterate over selected side dimensions for horizontal larger case
            for (let i = 0; i < this.selectedCells.length; i++) {
                let dataSet = {
                    label: rowNum + " ",
                    data: [],
                    borderWidth: 1,
                };
                console.log(rowNum)
                rowNum++;

                let colNum = startColInd + 1;

                for (let j = 0; j < this.selectedCells[0].length; j++) {

                    xValues[j] = this.getColName(colNum);
                    dataSet.data.push(this.selectedCells[i][j]);
                    colNum++;
                }

                dataSets.push(dataSet);

            }
        } else {

            let colNum = startColInd + 1;
            // Iterate over selected side dimensions for horizontal larger case
            for (let i = 0; i < this.selectedCells[0].length; i++) {
                let dataSet = {
                    label: this.getColName(colNum),
                    data: [],
                    borderWidth: 1,
                };
                colNum++;

                let rowNum = startRowInd + 1;

                for (let j = 0; j < this.selectedCells.length; j++) {

                    xValues[j] = rowNum;
                    dataSet.data.push(this.selectedCells[j][i]);
                    rowNum++;
                }

                dataSets.push(dataSet);

            }
        }


        console.log(xValues, dataSets)

        return { xValues, dataSets };
    }

    isHorizontalSizeBigger() {
        this.selectedCells = this.sheet.functionality.getSelectedCells();

        if (this.selectedCells.length > this.selectedCells[0].length) {
            return false;
        }
        return true;

    }

    // ensureSelectedCellsNotEmpty() {
    //     this.selectedCells = this.sheet.functionality.getSelectedCells();
    //     if (this.selectedCells.length <= 0) {
    //         return false;
    //     }
    //     return true;

    // }

    drawBarGraph() {
        this.graph.style.display = "inline-block";

        this.destroyGraph();

        // if (!this.ensureSelectedCellsNotEmpty()) {
        //     alert("Selected Cells is empty");
        //     return;
        // }

        const { xValues, dataSets } = this.getGraphValue();
        this.draw = new Chart(this.graphCanvas, {
            type: "bar",
            data: {
                labels: xValues,
                datasets: dataSets,
            },
        });
    }

    drawLineGraph() {
        this.graph.style.display = "inline-block";

        this.destroyGraph();

        // if (!this.ensureSelectedCellsNotEmpty()) {
        //     alert("Selected Cells is empty");
        //     return;
        // }
        const { xValues, dataSets } = this.getGraphValue();
        this.draw = new Chart(this.graphCanvas, {
            type: "line",
            data: {
                labels: xValues,
                datasets: dataSets,
            },
        });
    }

    drawPieGraph() {
        this.graph.style.display = "inline-block";

        this.destroyGraph();

        // if (!this.ensureSelectedCellsNotEmpty()) {
        //     alert("Selected Cells is empty");
        //     return;
        // }
        const { xValues, dataSets } = this.getGraphValue();
        this.draw = new Chart(this.graphCanvas, {
            type: "pie",
            data: {
                labels: xValues,
                datasets: dataSets,
            },
        });
    }


    dragChart(evt) {
        if (this.draging) {
            let graphX = this.graph.getBoundingClientRect().x;
            let graphY = this.graph.getBoundingClientRect().y;
            let newX = graphX + evt.movementX;
            if (newX > 0) {
                this.graph.style.left = newX + "px";
            }
            let newY = graphY + evt.movementY;
            if (newY > 0) {
                this.graph.style.top = newY + "px";
            }
        }
    }

    handleEvents() {

        this.graph.addEventListener("mousedown", () => {
            this.draging = true;
        });
        window.addEventListener("mouseup", () => {
            this.draging = false;
        });
        window.addEventListener("mousemove", this.dragChart.bind(this));
    }
}

















