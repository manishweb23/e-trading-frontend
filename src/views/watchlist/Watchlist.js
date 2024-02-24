import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CRow,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CInputGroup,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import { headers } from '../utils';

const Watchlist = () => {
  const [instruments, setInstruments] = useState([]);
  const [findSymbol, setFindSymbol] = useState('');
  const [instrumentsType, setInstrumentsType] = useState('OPT');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstrumentlist();
  }, [currentPage, pageSize, instrumentsType, findSymbol]);

  const fetchInstrumentlist = async () => {
    const instrumentType = 'OPT';
    const offset = (currentPage - 1) * pageSize;
    try {
      const url = `http://139.59.39.167/api/v1/instrument/all/type/${instrumentType}/name/${findSymbol?findSymbol:'null'}?limit=${pageSize}&offset=${offset}`;
      const response = await fetch(url);
      const result = await response.json();
      setInstruments(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInstrumentTypeChange = (e) => {
    setInstrumentsType(e.target.value);
  };

  const handleInstrumentSearch = () => {
    fetchInstrumentlist();
  };

  const placeOrder = (item) => {
    navigate(`/order?urlTradingSymbol=${item[2]}`);
  };

  return (
    <>
      <CRow>
        <CCol sm={3}>
          <CFormSelect value={instrumentsType} onChange={handleInstrumentTypeChange}>
            <option value="OPT">OPTION</option>
          </CFormSelect>
        </CCol>
        <CCol sm={4}>
          <CInputGroup className="mb-4">
            <CFormInput value={findSymbol} onChange={(e) => setFindSymbol(e.target.value)} placeholder="Enter Symbol" />
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
                    <CTableRow key={index}>
                      <CTableDataCell>{item[2]}</CTableDataCell>
                      <CTableDataCell className="text-center">{item[11].replace(/_/g, ' ')}</CTableDataCell>
                      <CTableDataCell className="text-center">{item[5]}</CTableDataCell>
                      <CTableDataCell>{item[4]}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton color="dark" onClick={() => placeOrder(item)}>Place Order</CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CPagination aria-label="Page navigation example">
          <CPaginationItem aria-label="Previous" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>
          {[...Array(20)].map((_, index) => (
            <CPaginationItem key={index} active={currentPage === index + 1} onClick={() => setCurrentPage(index + 1)}>
              {index + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem aria-label="Next" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === 10}>
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      </CRow>
    </>
  );
};

export default Watchlist;
