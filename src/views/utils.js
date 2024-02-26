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



export const token = "eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI2MkFIQVAiLCJqdGkiOiI2NWRjMTM5ZWQ3MmY5ZDc2MWE5OGFhZGMiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDg5MjE3NTgsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwODk4NDgwMH0.SG3JraBH8ntrknxUJVoOoBwEOHsdGQF7211FckAByfs"



