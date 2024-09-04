// worker.js
self.onmessage = async function (event) {

    const { jsonData, startInd , ll} = event.data;
    console.log(jsonData.startInd,ll)
    try {
        
    //inserts multiple data from json to LL
    for (let i = 1; i <= jsonData.length; i++) {
        let j = 1;

        Object.keys(jsonData[i - 1]).forEach(key => {

            if (jsonData[i - 1]) {
                // console.log(i+startInd, j, jsonData[i-1][key]);
                ll(i + startInd, j, jsonData[i - 1][key]);
                j++;
            }

        })

    }

    } catch (error) {
        self.postMessage({error})
    }
    self.postMessage("Done")

};
