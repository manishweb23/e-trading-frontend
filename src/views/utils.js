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



export const token = "eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI2MkFIQVAiLCJqdGkiOiI2NWRkY2JiMDQ1NzRjZDA5NDI0YTNmMmQiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDkwMzQ0MTYsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwOTA3MTIwMH0.egKilEy4LVTL5MF50kQCyAQ_BEIm2LOGUH7yKeskwHc"



