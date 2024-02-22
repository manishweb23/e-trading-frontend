import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [mobile, setMobile] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState(null)
  const [loginData, setLoginData] = useState(null)
  
  const navigate = useNavigate()
  const loginAccount = async () =>{
    try {
      const response = await axios.post('http://139.59.39.167/api/v1/user/login', {
        name:'test',
        mobile: mobile,
        password: password
      });
      try{
        console.log(response.data)
        const res_data= JSON.stringify(response.data)
        await localStorage.setItem('userData',JSON.stringify(res_data));
        setLoginData(response.data)
        setError(null); 
        console.log("Data saved successfully");
        navigate(`/dashboard`)
      } catch (e) {
          console.error("Error saving data to localStorage:", e);
      }
      

      
    } catch (error) {
      console.error('Error:', error);
      setError(error); 
    }
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Mobile" autoComplete="Mobile" onChange={(e) => setMobile(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={loginAccount}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        {/* <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton> */}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>E Paper Trading</h2>
                    <p>
                      
                    </p>
                    {/* <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link> */}
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
