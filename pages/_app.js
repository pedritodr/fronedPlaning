import {useState,useMemo,useEffect} from 'react';
import AuthContext from '../context/AuthContext';
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { setToken , getToken,removeToken} from './api/token';

function MyApp({ Component, pageProps }) {

  const [auth, setAuth] = useState(undefined);
  const [realoadUser, setReloadUser] = useState(false);
  const router = useRouter();
  if (auth === undefined) return null;
  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuth({
        token,
        idUser: jwtDecode(token).uid,
      });
    } else {
      setAuth(null);
    }
    setReloadUser(false);
  }, [realoadUser]);

  const login = (token) => {
    setToken(token);
    setAuth({
      token,
      idUser: jwtDecode(token).uid,
    });
  };

  const logout = () => {
    if (auth) {
      removeToken();
      setAuth(null);
      router.push("/");
    }else{
      router.push("/");
    }
  };

  const authData = useMemo(
    () => ({
      auth,
      login,
      logout,
      setReloadUser
    }),
    [auth]
  );

  return (
  <AuthContext.Provider value={authData}>
    <Component {...pageProps} />
  </AuthContext.Provider>)
}

export default MyApp
