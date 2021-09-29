import React, {useMemo} from 'react';
import AuthContext from '../context/AuthContext';
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file



function MyApp({ Component, pageProps }) {
  const authData = useMemo(
    () => ({
    }),
    []
  );
  return (
  <AuthContext.Provider value={authData}>
    <Component {...pageProps} />
  </AuthContext.Provider>)
}

export default MyApp
