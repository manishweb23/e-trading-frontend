import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { findBidPrice, findAskPrice, token } from '../utils';
import {
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CAvatar,
  CButton,
  CButtonGroup,
  CFormCheck,
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



const Portfolio = () => {

  const userDataString = localStorage.getItem('userData')
  let userData = JSON.parse(userDataString) 
  userData = JSON.parse(userData) 
  console.log(userData)
  let userToken = userData.data.token
  console.log(userToken)
  const userId = userData.data.user_id


  const [pl,setPL] = useState(0)
  const [isConnected, setIsConnected] = useState(false);
  const [fetchDataCalled, setFetchDataCalled] = useState(true);
  const [feedData, setFeedData] = useState([]);
  const [openSymbols,setOpenSymbols] = useState([]);
  const [data, setData] = useState([])
  const [orderType,setOrderType] = useState('open')
  const [bidAskPrice,setBidAskPrice] = useState([])
  const [intraday, setIntraday] = useState(false)


  
  const navigate = useNavigate()
  var totalPL = 0
  useEffect(() => {
    if(fetchDataCalled){
      fetchTradesData(orderType);
    }
    if(openSymbols.length > 0){
      initProtobuf();  
      connectWebSocket(token,openSymbols);
    }

  }, [orderType,openSymbols,fetchDataCalled]);

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
            instrumentKeys: urlTradingSymbol, 
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
        console.log('mmkkkmanishhh')
        setFeedData(response.feeds)
        console.log(feedData)
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

  const fetchTradesData = async (orderType) => {

    try {
      const headers = {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${userToken}`
      }

      const response = await axios.get(`http://139.59.39.167/api/v1/order/filter/user/${userId}/type/${orderType}`, { headers:headers });
      
      
      setOrderType(orderType)
      setFetchDataCalled(false)
      const jsonData = response
      console.log(jsonData.data)
      setData(jsonData.data.data)
      if(orderType == 'open'){
        const extractedSymbols = jsonData.data.data.map(item => item.symbol);
        console.log(extractedSymbols)
        setOpenSymbols(extractedSymbols);
      }
      
      console.log(jsonData.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const fetchTradesIntraDayData = async (intraday) => {

    try {
      const headers = {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${userToken}`
      }

      const response = await axios.get(`http://139.59.39.167/api/v1/order/filter/user/${userId}/intraday/${intraday}`, { headers:headers });
      
      
      setOrderType(orderType)
      setFetchDataCalled(false)
      const jsonData = response
      console.log(jsonData.data)
      setData(jsonData.data.data)
      if(orderType == 'open'){
        const extractedSymbols = jsonData.data.data.map(item => item.symbol);
        console.log(extractedSymbols)
        setOpenSymbols(extractedSymbols);
      }
      
      console.log(jsonData.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const closeOrder = async (order) => {
    try {
      const response = await axios.put(`http://139.59.39.167/api/v1/order/${order.id}`, {
        user_id: order.user_id,
        symbol: order.symbol,
        quantity:order.quantity,
        lot_size:order.lot_size
      });
  
      console.log(response); // Log the response data
      setOrderType('close')
      return response; // Return the response data if needed
    } catch (error) {
      console.error('Error closing order:', error);
      throw error; // Rethrow the error for the caller to handle if needed
    }
  };

  const gotoOrderClose = async (e) => {
    const jsonString = JSON.stringify(e);
    console.log("main");
    console.log(jsonString);
    await localStorage.setItem('placeOrderData', jsonString);
    navigate(`/close-order`)
  }

  

  
  return (
    <>
      <CRow>
        {/* <CCol sm={3}/> */}
        <CCol sm={3}>
          <CFormSelect value={orderType} onChange={(e) => fetchTradesData(e.target.value)}>
            <option value={"open"}>Open Trades</option>
            <option value={"close"}>Closed Trades</option>
            <option value={"all"}>All Trades</option>
          </CFormSelect>
        </CCol>
        <CCol sm={6}>
          <CFormSelect value={intraday} onChange={(e) => fetchTradesIntraDayData(e.target.value)}>
            <option value={null}>Select Intraday/Holdings trades</option>
            <option value={true}>Intraday Trades</option>
            <option value={false}>Holding Trades</option>
          </CFormSelect>
        </CCol>
        <CCol sm={1}>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Portfolio</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive striped>
                <CTableHead color="light">
                  <CTableRow>
                    {/* <CTableHeaderCell>Symbol</CTableHeaderCell> */}
                    <CTableHeaderCell>Trading Symbol</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Lot Size</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                    <CTableHeaderCell>Expiry</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Entry Price</CTableHeaderCell>
                    {orderType != 'all' &&(
                    <CTableHeaderCell className="text-center" >P & L</CTableHeaderCell>
                    )}

                    <CTableHeaderCell className="text-center">Exit Price</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Entry Time</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Exit Time</CTableHeaderCell>
                    {orderType === 'open' &&(
                    <CTableHeaderCell className="text-center">Close Order</CTableHeaderCell>
                    )}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                  {data?.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      {/* <CTableDataCell>
                        <div>{item.symbol}</div>
                      </CTableDataCell> */}
                      <CTableDataCell className="text-center">
                        <div>{item.trading_symbol}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div>{item.lot_size}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.quantity}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.expiry_date}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.open_price}</div>
                      </CTableDataCell>
                      {orderType === 'open' && item.order_short == true &&(
                      <CTableDataCell style={{with:'auto'}}>
                      {<div id={'pl'+index} style={{with:'200'}}>{feedData[item.symbol]?(findAskPrice(feedData[item.symbol].ff.marketFF.marketLevel.bidAskQuote)*item.lot_size*item.quantity - item.open_price*item.lot_size*item.quantity).toFixed(2):0 }</div> }
                      
                      </CTableDataCell>
                      )}
                      {orderType === 'open' && item.order_short == false &&(
                      <CTableDataCell  style={{with:'auto'}}>
                      {<div id={'pl'+index} style={{with:'200'}}>{feedData[item.symbol]?(findBidPrice(feedData[item.symbol].ff.marketFF.marketLevel.bidAskQuote)*item.lot_size*item.quantity - item.open_price*item.lot_size*item.quantity).toFixed(2):0 }</div> }
                      </CTableDataCell>
                      )}
                      {orderType === 'close' &&(
                      <CTableDataCell>
                      {<div>{(item.close_price*item.lot_size*item.quantity - item.open_price*item.lot_size*item.quantity).toFixed(2)}</div> }
                      
                      </CTableDataCell>
                      )}

                      <CTableDataCell>
                        <div>{item.close_price}</div>
                      </CTableDataCell>
                      
                      <CTableDataCell>
                        <div>{item.open_time}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.close_time}</div>
                      </CTableDataCell>
                      {orderType === 'open' &&
                        <CTableDataCell className="text-center">
                          <CButton color="dark" onClick={(e) => {
                            gotoOrderClose(item);
                          }}>Close Order</CButton>
                        </CTableDataCell>
                      }
                                          
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Portfolio
