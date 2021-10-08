import { useEffect, useState } from "react";
import { Navbar, Container } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { validToken } from "../../utils/validToken";
import axios from "axios";

const NavbarMain = () => {
  const { auth, logout } = useAuth();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
  (async()=>{
    const tokenValid = validToken(logout);
    if(tokenValid){
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_END_POINT}users/${auth.idUser}`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            'x-token':tokenValid
          },
        }
      );
      setUser(response.data.user);
    }
  })()
  }, [auth]);

  return (
    <Navbar style={{ borderBottom: "1px solid !important" }}>
      <Container fluid>
        <Navbar.Brand >
          Lista de programaciones de descargar
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
           {
             user !== undefined?user.name+' ':null
           }
            <a href="javacript:void" onClick={logout}>
              ! Logout
            </a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarMain;
