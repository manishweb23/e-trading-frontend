import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { findBidAndAskPrice, token } from '../utils';
import {
  CFormInput, 
  CFormSelect,
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsA,
  CInputGroupText,
  CInputGroup,
  CWidgetStatsC,
} from '@coreui/react'
import proto from "./marketDataFeed.proto";
import { Buffer } from "buffer";
const protobuf = require("protobufjs");

// Initialize Protobuf root
let protobufRoot = null;
const initProtobuf = async () => {
  protobufRoot = await protobuf.load(proto);
  console.log("Protobuf part initialization complete");
};


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

const CloseOrder = () => {  
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(false);
  const [feedData, setFeedData] = useState([]);
  const [ltpcData, setLtpcData] = useState([]);
  const [averagePrice, setAveragePrice] = useState(0);
  const [bidAskQuote, setBidAskQuote] = useState(null);
  const [bidPrice,setBidPrice] = useState(0)
  const [askPrice,setAskPrice] = useState(0)
  
  const storedJsonString = localStorage.getItem('placeOrderData'); 
  console.log(storedJsonString);

  const openOrderJson = JSON.parse(storedJsonString);
  console.log(openOrderJson);

  useEffect(() => {
    
    initProtobuf();
    
    connectWebSocket(token,openOrderJson.symbol);

    // Cleanup function (optional)
    return () => {
      // Perform cleanup (unsubscribe, clear intervals, etc.)
    }
  }, [token])  
  

  const connectWebSocket = async (token,urlTradingSymbol) => {
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
        const [bp, ap] = findBidAndAskPrice(response.feeds[urlTradingSymbol].ff.marketFF.marketLevel.bidAskQuote)
        setBidPrice(bp)
        setAskPrice(ap)
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

  console.log("ltpc data")
  console.log(ltpcData)

  const closeOpenOrder = async (order) => {
    const userDataString = localStorage.getItem('userData')
    let userData = JSON.parse(userDataString) 
    userData = JSON.parse(userData) 
    console.log(userData)
    let userToken = userData.data.token
    console.log(userToken)
    const userId = userData.data.user_id
    try {
      const headers = {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${userToken}`
      }
      const response = await axios.put(`http://127.0.0.1:8000/api/v1/order/${order.id}`, {
        user_id: order.user_id,
        symbol: order.symbol,
        quantity:order.quantity,
        lot_size:order.lot_size
      },{headers:headers});
  
      console.log(response); // Log the response data
      alert(response.data.data.message)
      navigate('/portfolio')

    } catch (error) {
      console.error('Error closing order:', error);
      throw error; // Rethrow the error for the caller to handle if needed
    }
  };

  return (
    <>    
    <CRow>
    <CCol sm={3}/>
    <CCol sm={6}>
      {console.log(feedData)}
      <CWidgetStatsC
        className="mb-3"
        color="primary"
        inverse
        progress={{ value: 75 }}
        text=""
        title="P & L"
        value={(askPrice*openOrderJson.lot_size*openOrderJson.quantity - openOrderJson.open_price*openOrderJson.lot_size*openOrderJson.quantity).toFixed(3)}
      />  
      <CCard>
        <CCardBody>
          <b>Bid Price :</b> {bidPrice}<br/>
          <b>Ask Price :</b> {askPrice}<br/>
          <b>Buy price :</b> {openOrderJson.open_price}<br/>
          <b>Symbol :</b> {openOrderJson.trading_symbol}<br/>
          <b>Buy Time :</b> {openOrderJson.open_time}</CCardBody>

      </CCard>
    </CCol>
    </CRow>
    <CRow>
    <CCol sm={3}/>
    <CCol sm={6}><br/>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CButton color="danger" size="lg" onClick={(e) => closeOpenOrder(openOrderJson)}>Close Order</CButton>
    </div>
    </CCol>
    </CRow>
    </>
  )
}

export default CloseOrder
