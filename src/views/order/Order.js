import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { findBidAndAskPrice, token } from '../utils';
import {
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CAccordion,
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
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
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

const Order = () => {  
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(false);
  const [feedData, setFeedData] = useState([]);
  const [tradingSymbol, setTradingSymbol] = useState('');
  const [ltpcData, setLtpcData] = useState(null);
  const [totalQuantity,setTotalQuantity] = useState(1)
  const [openOrders, setOpenOrders] = useState(null)
  const [symbolValue, setSymbolValue] = useState('NIFTY');
  const [bidPrice, setBidPrice] = useState(0);
  const [askPrice, setAskPrice] = useState(0);
  const [bidAskQuote, setBidAskQuote] = useState(null);
  const [isEquityShort, setIsEquityShort] = useState(false)
  const [postData, setPostData] = useState({ name: '', email: '' })
  const [responseMessage, setResponseMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectTradingSymbol, setSelectTradingSymbol] = useState([]);

  
  const [selectedExpiry, setSelectedExpiry] = useState('');
  const fetchOptions = async () => {
    try {
      // Make an API call to fetch options based on symbolValue
      const response = await fetch(`http://139.59.39.167/api/v1/instrument/expiry/symbol/${symbolValue}`);
      const data = await response.json();
      // Update options state with fetched data
      console.log(data.data.expiry)
      setSelectOptions(data.data.expiry);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  // Function to fetch options based on input value
  const fetchTradingSymbol = async () => {
    try {
      // Make an API call to fetch options based on symbolValue
      const response = await fetch(`http://139.59.39.167/api/v1/instrument/symbol/${symbolValue}/expiry/${selectedExpiry}`);
      const data = await response.json();
      // Update options state with fetched data
      console.log("manish-----0000")
      console.log(data.data)
      setSelectTradingSymbol(data.data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const storedJsonString = localStorage.getItem('placeOrderData')
  console.log(storedJsonString)
  console.log("kkr")
  const tradingSymbolsArray =storedJsonString.split(',');
  console.log(tradingSymbolsArray[2])
  const connectWebSocket = async (token,urlTradingSymbol) => {
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
        setLtpcData(response.feeds[urlTradingSymbol].ff.marketFF?.ltpc)
        setBidAskQuote(response.feeds[urlTradingSymbol].ff.marketFF?.marketLevel.bidAskQuote)
        const [bp, ap] = findBidAndAskPrice(response.feeds[urlTradingSymbol].ff.marketFF?.marketLevel.bidAskQuote)
        setBidPrice(bp)
        setAskPrice(ap)
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

  useEffect(() => {
    
    initProtobuf();
    
    setTradingSymbol(tradingSymbolsArray[3])
    
    connectWebSocket(token,tradingSymbolsArray[0]);

    // // Function to fetch data
    // const fetchOpenOrder = async () => {
    //   try {
    //     const response = await fetch('http://139.59.39.167/api/v1/order/filter/user/1/type/open')
    //     const result = await response.json()
    //     setOpenOrders(result)
    //     console.log(result)
    //   } catch (error) {
    //     console.error('Error fetching data:', error)
    //   }
    // }

    // // Call the fetch function
    // fetchOpenOrder()

    // if (symbolValue.trim() !== '') {
    //   fetchOptions()
    // }
    // Cleanup function (optional)
    return () => {
      // Perform cleanup (unsubscribe, clear intervals, etc.)
    }
  }, [symbolValue,token])  

  
  const openOrder = async () => {
    const userDataString = localStorage.getItem('userData')
    let userData = JSON.parse(userDataString) 
    userData = JSON.parse(userData) 
    console.log(userData)
    let userToken = userData.data.token
    console.log(userToken)
    const userId = userData.data.user_id
  
    // setLoading(true)
    const postData = {
      "user_id": userId,
      "symbol": tradingSymbolsArray[0],
      "trading_symbol": tradingSymbolsArray[2],
      "exchange": tradingSymbolsArray[11],
      "trade_type": tradingSymbolsArray[9],
      "equity_short": isEquityShort,
      "expiry_date": tradingSymbolsArray[5],
      "quantity": totalQuantity,
      "lot_size": tradingSymbolsArray[8],
    }
    try {
      const headers = {
        'Content-Type':'application/json',
        'Accept':'*/*',
        'Authorization': `Bearer ${userToken}`
      }
      console.log(headers)
      console.log(postData)
      // Make a POST request using axios.post
      const response = await axios.post('http://139.59.39.167/api/v1/order', postData, {headers:headers})
      // console.log("jjkkuuiopp")
      // console.log(response.status)
      setResponseMessage(response.data)
      // Access the order_id field
      const msg=response.data.data.message
      alert(msg)
      console.log(response.data)
      if(msg != "Insuficeint balance!"){
        navigate(`/portfolio`)
      }
        
    } catch (error) {
      console.error('Error submitting data:', error)
      setResponseMessage('An error occurred while submitting data.')
    } finally {
      // setLoading(false)
    }
  }

  const openSellOrder = async () => {
    setIsEquityShort(true)
    openOrder()
  }

  return (
    <>    
    <CRow>
      <CCol sm={3}/>
      <CCol sm={6}>        
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={
            <>
              {ltpcData?.ltp}
              {/* <span className="fs-6 fw-normal">
                (40.9% <CIcon icon={cilArrowTop} />)
              </span> */}
            </>
          }
          title={tradingSymbol !==''? tradingSymbol: tradingSymbolsArray[2]}
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['', '', '', '', '', '', ''],
                datasets: [
                  {
                    label: '',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: '#321fdb',
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
          />
          </CCol>
      </CRow>  
      
      <CRow>
        <CCol sm={3}/>
        <CCol sm={6}>
          <CRow>
            <CCol sm={12}>
            <CAccordion activeItemKey={2}>
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>Details</CAccordionHeader>
                <CAccordionBody>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      border: '1px solid black',
                      textAlign: 'center',
                    }}
                  >
                    <tr style={{ margin: '0', padding: '0' }}>
                      <th style={{ border: '1px solid black' }}>Bid</th>
                      <th style={{ border: '1px solid black' }}>Ask</th>
                    </tr>
                    
                    {
                      bidAskQuote?.map((data, index) => (
                        <React.Fragment key={index}>
                          <tr style={{ fontWeight: 'bold' }}>
                          <td style={{ border: '1px solid black', fontSize: '10px' }}>Quantity:{data.bq} | Price:{data.bp} </td>
                          <td style={{ border: '1px solid black', fontSize: '10px' }}>Quantity:{data.aq} | Price:{data.ap} </td>
                          </tr>
                        </React.Fragment>
                      ))
                    }
                                            
                  </table>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={12}>
              <br/>
            <CInputGroup className="mb-3">
              
              <CInputGroupText id="basic-addon1">Lot Size : {tradingSymbolsArray[8]} x</CInputGroupText>
              <CFormInput value={totalQuantity} onChange={(e) => setTotalQuantity(e.target.value)}placeholder="Quantity" aria-label="Quantity" aria-describedby="basic-addon1"/>
            
            </CInputGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={12}>
            <CInputGroupText id="basic-addon1">Quantity x Lot Size : {tradingSymbolsArray[8] * totalQuantity} </CInputGroupText>
            
            </CCol>
            <CCol sm={12}>
            <CInputGroupText id="basic-addon1">Bid Price : {bidPrice} </CInputGroupText>
            <CInputGroupText id="basic-addon1">Ask Price : {askPrice} </CInputGroupText>
            
            </CCol>
          </CRow>
          {tradingSymbolsArray[9][0] == 'O' && (
            <div className="d-grid gap-2">
              <br/>
              <CButton color="success" onClick={(e) => openOrder()}>Place Order</CButton>
            </div>
          )}
          {tradingSymbolsArray[9][0] !== 'O' && (
            <CRow>
            <CCol sm={6}>
              <div className="d-grid gap-2">
                <CButton color="success" onClick={(e) => openOrder()}>Buy</CButton>
              </div>
            </CCol>
            <CCol sm={6}>
              <div className="d-grid gap-2">
                <CButton color="danger" onClick={(e) => openSellOrder()}>Sell</CButton>
              </div>
            </CCol>
          </CRow>
          )}
        </CCol>
      </CRow>
    </>
  )
}

export default Order
