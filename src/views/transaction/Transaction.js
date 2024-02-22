import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import {
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

const Transaction = () => {
  
  const [isConnected, setIsConnected] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
 
  useEffect(() => {
    fetchData(1)
  },[]);

  const fetchData = async (user_id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/transaction/user/${user_id}`);
      console.log("manish")
      console.log(response.data.data); // Log the response data
      setTransactionData(response.data.data) // Return the response data if needed
    } catch (error) {
      console.error('Error closing order:', error);
      throw error; // Rethrow the error for the caller to handle if needed
    }
  };


  return (
    <>
      <CRow>
        {/* <CCol sm={3}/> */}
        <CCol sm={3}>
          {/* <CFormSelect value={transactionType} onChange={(e) => fetchData(e.target.value)}>
            <option value={"CR"}>Credit</option>
            <option value={"DR"}>Debit</option>
            <option value={"all"}>All</option>
          </CFormSelect> */}
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Transactions</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive striped>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {transactionData?.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item.amount}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.transaction_type}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.created_at}</div>
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

export default Transaction
