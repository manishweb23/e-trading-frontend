

// Function to get WebSocket URL
const getUrl = async (token) => {
  const apiUrl = "https://api-v2.upstox.com/feed/market-data-feed/authorize";
  let headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: headers,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res = await response.json();
  return res.data.authorizedRedirectUri;
};

// Helper functions for handling Blob and ArrayBuffer
const blobToArrayBuffer = async (blob) => {
  if ("arrayBuffer" in blob) return await blob.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject();
    reader.readAsArrayBuffer(blob);
  });
};

// Decode Protobuf messages
const decodeProfobuf = (buffer) => {
  if (!protobufRoot) {
    console.warn("Protobuf part not initialized yet!");
    return null;
  }
  const FeedResponse = protobufRoot.lookupType(
    "com.upstox.marketdatafeeder.rpc.proto.FeedResponse"
  );
  return FeedResponse.decode(buffer);
};


export const connectWebSocket = async (token,urlTradingSymbol) => {
    console.log("llr")
    console.log(urlTradingSymbol)
    try {
      const wsUrl = await getUrl(token);
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setIsConnected(true);
        console.log("Connected");
        const data = {
          guid: "someguid",
          method: "sub",
          data: {
            mode: "full",
            instrumentKeys: [urlTradingSymbol], 
          },
        };
        ws.send(Buffer.from(JSON.stringify(data)));
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log("Disconnected");
      };

      ws.onmessage = async (event) => {
        const arrayBuffer = await blobToArrayBuffer(event.data);
        let buffer = Buffer.from(arrayBuffer);
        let response = decodeProfobuf(buffer);
        setFeedData((currentData) => [
          ...currentData,
          JSON.stringify(response),
        ]);
        setLtpcData(response.feeds[urlTradingSymbol].ff.marketFF.ltpc)
        setBidAskQuote(response.feeds[urlTradingSymbol].ff.marketFF.marketLevel.bidAskQuote)
        console.log(response)
      };

      ws.onerror = (error) => {
        setIsConnected(false);
        console.log("WebSocket error:", error);
      };

      return () => ws.close();
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  };


