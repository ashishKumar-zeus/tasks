

export class Graph {

    constructor(sheet) {

        this.sheet = sheet;
        //getting graph buttons


        this.graphCanvas = document.getElementById('graphCanvas');
        this.graph = document.getElementById('graph')
        
        this.barGraphBtn = document.getElementById("barGraphBtn")
        this.pieGraphBtn = document.getElementById("pieGraphBtn")
        this.lineGraphBtn = document.getElementById("lineGraphBtn")
        this.graphCloseBtn = document.querySelector(".graphClose");

        

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
    }

    destroyGraph() {
        if (this.draw) {
            this.draw.destroy();
        }
    }

    getGraphValue() {
        let xValues = [];
        let dataSets = [];

        // Determine if the horizontal size is larger
        const isHorizontalLarger = this.isHorizontalSizeBigger();

        if (isHorizontalLarger) {
            // Iterate over selected side dimensions for horizontal larger case
            for (let i = 0; i < this.dimension.selectedSide.length; i++) {
                let dataSet = {
                    label: this.dimension.selectedSide[i].value, // Label for each dataset
                    data: [],
                    borderWidth: 1,
                };

                for (let j = 0; j < this.dimension.selectedTop.length; j++) {
                    xValues[j] = this.dimension.selectedTop[j].value;
                    dataSet.data.push(
                        this.mainGrid.mainCells[this.dimension.sideValues[i]][
                            this.dimension.getColumnNumber(this.dimension.topValues[j]) - 1
                        ].value
                    );
                }

                dataSets.push(dataSet);
            }
        } else {
            // Iterate over selected top dimensions for vertical larger case
            for (let i = 0; i < this.dimension.selectedTop.length; i++) {
                let dataSet = {
                    label: this.dimension.selectedTop[i].value,
                    data: [],
                    borderWidth: 1,
                };

                for (let j = 0; j < this.dimension.selectedSide.length; j++) {
                    xValues[j] = this.dimension.selectedSide[j].value;
                    dataSet.data.push(
                        this.mainGrid.mainCells[this.dimension.sideValues[j]][
                            this.dimension.getColumnNumber(this.dimension.topValues[i]) - 1
                        ].value
                    );
                }

                dataSets.push(dataSet);
            }
        }

        return { xValues, dataSets };
    }

    isHorizontalSizeBigger() {
        // return (
            // this.sheet.functionality.selectedCells > this.dimension.selectedSide.length
            console.log(this.sheet)
        // );
    }

    drawBarGraph() {
        this.destroyGraph();
        const { xValues, dataSets } = this.getGraphValue();
        this.draw = new Chart(this.graphCanvasElement, {
            type: "bar",
            data: {
                labels: xValues,
                datasets: dataSets,
            },
        });
    }

    drawLineGraph() {
        this.destroyGraph();
        const { xValues, dataSets } = this.getGraphValue();
        this.draw = new Chart(this.graphCanvasElement, {
            type: "line",
            data: {
                labels: xValues,
                datasets: dataSets,
            },
        });
    }

    drawPieGraph() {
        this.destroyGraph();
        const { xValues, dataSets } = this.getGraphValue();
        this.draw = new Chart(this.graphCanvasElement, {
            type: "pie",
            data: {
                labels: xValues,
                datasets: dataSets,
            },
        });
    }
}
