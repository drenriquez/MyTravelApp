
//  ASYNC GET
async function getCodeOrNation (url = ''){
    const request = await fetch(url);
    try {
        const allData = await request.json();
        return allData;
    } catch (error) {
        console.log("error", error);
    }
};
export { getCodeOrNation }