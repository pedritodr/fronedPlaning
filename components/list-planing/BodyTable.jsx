import { Table, ButtonGroup,DropdownButton,Dropdown } from "react-bootstrap";

const BodyTable = () => {
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha de planificación</th>
            <th>Fecha terminado proceso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>61522789ea3cbecec13b859c</td>
            <td>2021/09/17</td>
            <td>Sin definir</td>
            <td>Por iniciar</td>
            <td>
              <ButtonGroup>
                <DropdownButton
                  as={ButtonGroup}
                  title="Acciones"
                  id="bg-nested-dropdown"
                  variant="outline-dark"
                >
                  <Dropdown.Item eventKey="1">Eliminar</Dropdown.Item>
                  <Dropdown.Item eventKey="2">Logs</Dropdown.Item>
                </DropdownButton>
              </ButtonGroup>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default BodyTable;
