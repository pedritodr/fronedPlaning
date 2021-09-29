import {Navbar,Container} from 'react-bootstrap'

const NavbarMain = () => {
  return (
      <Navbar  style={{borderBottom: "1px solid !important"}}>
  <Container fluid>
    <Navbar.Brand href="#home">Lista de programaciones de descargar</Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse className="justify-content-end">
      <Navbar.Text>
      Mi empresa <a href="#login">! Logout</a>
      </Navbar.Text>
    </Navbar.Collapse>
  </Container>
</Navbar>
  );
};

export default NavbarMain;
