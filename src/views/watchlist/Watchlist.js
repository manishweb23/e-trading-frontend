import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import {
  CPagination,
  CPaginationItem,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormInput,
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
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { headers } from '../utils';



const Watchlist = () => {
  const [instruments, setInstruments] = useState([])
  
  const [findSymbol, setFindSymbol] = useState('')
  const [instrumentsType, setInstrumentsType] = useState('OPT')
  const [postData, setPostData] = useState({ name: '', email: '' })
  const [responseMessage, setResponseMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // const history = useHistory()
  const navigate = useNavigate()

  useEffect(() => {
    // Call the fetch function
    fetchInstrumentlist("FUTSTK",null)

    // Cleanup function (optional)
    return () => {
      // Perform cleanup (unsubscribe, clear intervals, etc.)
    }
  }, [currentPage, pageSize])
  
 
  // Function to fetch data
  const fetchInstrumentlist = async (instrument_type, symbol_name) => {
    const offset = (currentPage - 1) * pageSize;
    try {
      var url = `http://139.59.39.167/api/v1/instrument/all/type/${instrument_type}/name/${symbol_name}?limit=100&offset=${offset}`
      const response = await fetch(url)
    
      const result = await response.json()
      setInstruments(result.data)
      console.log("manish334")
      console.log(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }


  const handleInstrumentTypeChange = async (e) => {
    setInstrumentsType(e.target.value)
    fetchInstrumentlist(e.target.value,null)
  }

  const handleInstrumentSearch = async () => {
    fetchInstrumentlist(instrumentsType,findSymbol)
  }

  const placeOrder = async (e) => {
    // setPlaceOrderData(e)
    const jsonString = JSON.stringify(e)
    console.log(jsonString)
    localStorage.setItem('placeOrderData', e)
    // history.push('/order')
    navigate(`/order?urlTradingSymbol=${e[2]}`)
  }

  return (
    <>
      <CRow>
        {/* <CCol sm={3}/> */}
        <CCol sm={4}>
          <CFormSelect value={instrumentsType} onChange={(e) => handleInstrumentTypeChange(e)}>
            <option value={"FUTSTK"}>Futures on Stock</option>
            <option value={"FUTIDX"}>Futures on Index</option>
            <option value={"FUTCOM"}>Futures on Commodity</option>
            <option value={"OPTSTK"}>Options on Stock</option>
            <option value={"OPTIDX"}>Options on Index</option>
            <option value={"OPTCOM"}>Option on Commodity</option>
            <option value={"FUTCUR"}>Futures on Currency</option>
            <option value={"OPTCUR"}>Options on Currency</option>
            <option value={"EQUITY"}>Equity</option>

          </CFormSelect>
        </CCol>
        <CCol sm={4}>
          <CInputGroup className="mb-4">
            <CFormInput value={findSymbol} onChange={(e)=> setFindSymbol(e.target.value)}placeholder="Enter Symbol" aria-label="Enter Symbol" aria-describedby="basic-addon1"/>
          </CInputGroup>
        </CCol>
        <CCol sm={2}>
          <div className="d-grid gap-2">
              <CButton color="success" onClick={handleInstrumentSearch}>Search</CButton>
            </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Watchlist</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive striped>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Symbol</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Type</CTableHeaderCell>
                    
                    <CTableHeaderCell>Expiry</CTableHeaderCell>
                    <CTableHeaderCell>Last Price</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Order</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                  {instruments.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item[2]}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div>{item[11].replace(/_/g, " ")}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div>{item[5]}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item[4]}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton color="dark" onClick = {(e) => {
                          placeOrder(item)
                          }}>Place Order</CButton>
                      </CTableDataCell>
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

export default Watchlist
