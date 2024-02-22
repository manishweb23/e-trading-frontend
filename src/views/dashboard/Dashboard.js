import React from 'react'

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

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  
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
            value="INR 100000"
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
            value="5"
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
            value="INR 200000"
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
            value="Profite INR 30000"
          />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
