import Table from "react-bootstrap/Table";

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
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

        </tbody>
      </Table>
    </>
  );
};

export default BodyTable;
