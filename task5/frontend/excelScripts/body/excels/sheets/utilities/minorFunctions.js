export class MinorFunctions{
    constructor(sheet){
        this.sheet = sheet;
    }

    get_Min_Max_Avg_Sum_Count_OfArray(data){
        let resultObj = this.processArray(data);
        if(resultObj.count>1){
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

                if((!isNaN(value))){
                    sum += value;
                    if (value < min) min = value;
                    if (value > max) max = value;
                    count++;
                }
            }
        }

        let avg = count === 0 ? 0 : sum / count;
        return {"min":min.toFixed(2), "max":max.toFixed(2), "avg":avg.toFixed(2), "sum" : sum.toFixed(2), "count":count };
    }
}