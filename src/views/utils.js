export function findBidAndAskPrice(buySellData) {
    // Extract bid and ask prices
    const bidPrices = buySellData.map(order => order.bp);
    const askPrices = buySellData.map(order => order.ap);

    // Calculate bid and ask
    const bidPrice = Math.max(...bidPrices);
    const askPrice = Math.min(...askPrices);
    return [bidPrice, askPrice];
}


export function findBidPrice(buySellData) {
    // Extract bid and ask prices
    const bidPrices = buySellData.map(order => order.bp);

    // Calculate bid and ask
    const bidPrice = Math.max(...bidPrices);
    return bidPrice
}

export function findAskPrice(buySellData) {
    // Extract bid and ask prices
    const askPrices = buySellData.map(order => order.ap);

    // Calculate bid and ask
    const askPrice = Math.max(...askPrices);
    return askPrice
}



export const token = "eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI2MkFIQVAiLCJqdGkiOiI2NWRkNjNkOTUwZmY5MDRmNzJjODZmYjAiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDkwMDc4MzMsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwOTA3MTIwMH0.go4OaQ2hnmv5-vSzjzYbPtg7R-S42AhMiziMfJZvdDU"



