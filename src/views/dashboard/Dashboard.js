import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {
  CWidgetStatsC,
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
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cilChartPie,
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'


import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [balance, setBalance] = useState("INR 0")
  const [tradeCount, setTradeCount] = useState(0)
  const [tradingBalance, setTradingBalance] = useState(0)
  const [pL, setPL] = useState(0)
  
  const userDataString = localStorage.getItem('userData')
  let userData = JSON.parse(userDataString) 
  userData = JSON.parse(userData) 
  console.log(userData)
  let userToken = userData.data.token
  console.log(userToken)
  const userId = userData.data.user_id

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
  const navigate = useNavigate()
  useEffect(() => {
    
    fetchBalance(userId)
    fetchTradesCount(userId,'open')
    fetchTradingBalance(userId)
    fetchPL(userId)
  },[userId])

  const fetchBalance = async (userId) =>{
    const url = `http://139.59.39.167/api/v1/transaction/user/${userId}/balance`;
    // Set the headers with the Bearer token
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    };

    // Make the GET request using Axios
    axios.get(url, config)
      .then(response => {
        // Handle the successful response
        console.log('Balance:', response.data.data.balance);
        setBalance("INR "+ response.data.data.balance)
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching balance:', error);
    });
  }
  

  const fetchPL = async (userId) =>{
    const url = `http://139.59.39.167/api/v1/transaction/user/${userId}/pl`;
    // Set the headers with the Bearer token
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    };

    // Make the GET request using Axios
    axios.get(url, config)
      .then(response => {
        // Handle the successful response
        console.log('pl Balance:', response.data.data.balance);
        setPL("INR "+ (response.data.data.balance).toFixed(2))
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching balance:', error);
    });
  }

  const fetchTradesCount = async (userId,tradeType) =>{
    const url = `http://139.59.39.167/api/v1/order/filter/user/${userId}/type/${tradeType}/count`;
    
    // Set the headers with the Bearer token
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    };

    // Make the GET request using Axios
    axios.get(url, config)
      .then(response => {
        // Handle the successful response
        console.log(response.data.data.count);
        setTradeCount(response.data.data.count)
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching balance:', error);
    });
  }

  const fetchTradingBalance = async (userId) =>{
    const url = `http://139.59.39.167/api/v1/order/user/${userId}/trading-balance`;
    // Set the headers with the Bearer token
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    };

    // Make the GET request using Axios
    axios.get(url, config)
      .then(response => {
        // Handle the successful response
        console.log('T Balance:', response.data.data.balance);
        let tbalance = response.data.data.balance
        setTradingBalance("INR "+ tbalance.toFixed(2))
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching balance:', error);
    });
  }



  return (
    <>
      <CRow>
        <CCol xs={6}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            color="primary"
            inverse
            progress={{ color: 'success', value: 75 }}
            text="Widget helper text"
            title="Available Balance"
            value={balance}
          />
        </CCol>
        <CCol xs={6}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            color="primary"
            inverse
            progress={{ value: 75 }}
            text="Widget helper text"
            title="Open Trades"
            value={tradeCount}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={6}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            color="primary"
            inverse
            progress={{ color: 'primary', value: 75 }}
            text="Widget helper text"
            title="Trading Balance"
            value={tradingBalance}
          />
        </CCol>
        <CCol xs={6}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            color="primary"
            inverse
            progress={{ value: 75 }}
            text="Widget helper text"
            title="P&L"
            value={pL}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
