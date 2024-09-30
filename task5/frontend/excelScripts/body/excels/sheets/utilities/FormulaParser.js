

export class FormulaParser {
    constructor(matrix) {
        this.matrix = matrix; // Reference to the SparseMatrix
    }

    // Function to parse and evaluate the formula
    evaluateFormula(input) {
        if (!input.startsWith("=")) return input; // Only process formulas that start with "="
        
        // Remove the "=" sign
        let formula = input.slice(1).toUpperCase().trim();
        
        if (formula.startsWith("SUM")) {
            return this.handleSum(formula);
        } else if (formula.startsWith("MIN")) {
            return this.handleMin(formula);
        } else if (formula.startsWith("MAX")) {
            return this.handleMax(formula);
        } else if (formula.startsWith("AVG")) {
            return this.handleAverage(formula);
        }
        else return input;
        
        // throw new Error("Unsupported formula: " + formula);
    }

    // Utility function to convert a cell reference like A1 to row, col
    getCellPosition(cellRef) {
        // Extract column and row parts
        const colRef = cellRef.replace(/[0-9]/g, ''); // Extract letters (column part)
        const row = parseInt(cellRef.replace(/[A-Z]/g, '')) - 1; // Extract digits (row part)
    
        // Convert column reference to a number (A = 0, B = 1, ..., Z = 25, AA = 26, etc.)
        let col = 0;
        for (let i = 0; i < colRef.length; i++) {
            col = col * 26 + (colRef.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
        }
        col--; // Convert from 1-based index to 0-based index
    
        return { row, col };
    }
    

    // Extract range from a formula like A1:B4
    getRange(range) {
        const [startCell, endCell] = range.split(":");
        const start = this.getCellPosition(startCell);
        const end = this.getCellPosition(endCell);
        return { start, end };
    }

    // Handle SUM function
    handleSum(formula) {
        const range = formula.match(/\((.*?)\)/)[1]; // Extract the range inside parentheses
        const { start, end } = this.getRange(range);
        console.log("found sum query")
        let sum = 0;
        for (let row = start.row; row <= end.row; row++) {
            for (let col = start.col; col <= end.col; col++) {
                const value = this.matrix.getValueAtInd(row, col);
                console.log(row+1,col+1);
                sum += (( value &&  !isNaN(value)) ? parseFloat(value) : 0);
            }
        }
        return sum;
    }

    // Handle MIN function
    handleMin(formula) {
        const range = formula.match(/\((.*?)\)/)[1];
        const { start, end } = this.getRange(range);

        let min = Infinity;
        for (let row = start.row; row <= end.row; row++) {
            for (let col = start.col; col <= end.col; col++) {
                const value = this.matrix.getValueAtInd(row+1, col+1);
                if (( value!=null &&  !isNaN(value))) {
                    min = Math.min(min, parseFloat(value));
                }
            }
        }
        return min === Infinity ? 0 : min;
    }

    // Handle MAX function
    handleMax(formula) {
        const range = formula.match(/\((.*?)\)/)[1];
        const { start, end } = this.getRange(range);

        let max = -Infinity;
        for (let row = start.row; row <= end.row; row++) {
            for (let col = start.col; col <= end.col; col++) {
                const value = this.matrix.getValueAtInd(row+1, col+1);
                if (( value!=null &&  !isNaN(value))) {
                    max = Math.max(max, parseFloat(value));
                }
            }
        }
        return max === -Infinity ? 0 : max;
    }

    // Handle AVERAGE function
    handleAverage(formula) {
        const range = formula.match(/\((.*?)\)/)[1];
        const { start, end } = this.getRange(range);

        let sum = 0, count = 0;
        for (let row = start.row; row <= end.row; row++) {
            for (let col = start.col; col <= end.col; col++) {
                const value = this.matrix.getValueAtInd(row+1, col+1);
                if (( value!=null &&  !isNaN(value))) {
                    sum += parseFloat(value);
                    count++;
                }
            }
        }
        return count === 0 ? 0 : sum / count;
    }
}
