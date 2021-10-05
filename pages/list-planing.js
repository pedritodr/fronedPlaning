import { useCallback, useMemo, useState, useRef } from "react";
import { Column } from "react-table";
import { ButtonGroup, DropdownButton, Dropdown } from "react-bootstrap";
import { useRouter } from "next/router";
import BodyTable from "../components/list-planing/BodyTable";
import ButtonTop from "../components/list-planing/ButtonTop";
import Layout from "../layouts/Layout";
import useAuth from "../hooks/useAuth";
import { validToken } from "../utils/validToken";
import axios from "axios";
import Swal from "sweetalert2";

const listPlaning = () => {
  const { auth, logout } = useAuth();
  const router = useRouter();
  if (auth === null) {
    router.replace("/");
    return null;
  }

  const [isLoading, setLoading] = useState(false);
  const [planings, setPlanings] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  const fetchData = useCallback(async function (page) {
    setLoading(true);
    const tokenValid = validToken(logout);
    if (tokenValid) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/planing/${page + 1}`,
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
              "x-token": tokenValid,
            },
          }
        );
        setPlanings(response.data.planings);
        setPageCount(response.data.total_pages);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: (properties) => {
          const dateCreate = new Date(properties.date_create);
          let typeDocument;
          if (properties.document_type === "01") {
            typeDocument = "Factura";
          } else if (properties.document_type === "03") {
            typeDocument = "LC";
          } else if (properties.document_type === "04") {
            typeDocument = "NC";
          } else if (properties.document_type === "05") {
            typeDocument = "ND";
          } else if (properties.document_type === "06") {
            typeDocument = "GR";
          } else if (properties.document_type === "07") {
            typeDocument = "CR";
          } else {
            typeDocument = "";
          }
          return dateCreate.toISOString().slice(0, 10) + "-" + typeDocument;
        },
      },
      {
        Header: "Fecha de planificación",
        accessor: "date_begin",
        Cell: (props) => {
          const dateBegin = new Date(props.row.values.date_begin);
          return dateBegin.toISOString().slice(0, 10);
        },
      },
      {
        Header: "Fecha terminado proceso",
        accessor: "date_end",
        Cell: (props) => {
          const dateEnd = new Date(props.row.values.date_end);
          return dateEnd.toISOString().slice(0, 10);
        },
      },
      {
        Header: "Estado",
        accessor: "status",
        Cell: (props) => {
          if (props.row.values.status === 0) {
            return "Por iniciar";
          } else if (props.row.values.status === 1) {
            return "En proceso";
          } else {
            return "Culmidada";
          }
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          return (
            <ButtonGroup>
              <DropdownButton
                as={ButtonGroup}
                title="Acciones"
                id="bg-nested-dropdown"
                variant="outline-dark"
              >
                <Dropdown.Item
                  onClick={() => handleDeletePlaning(props.row)}
                  eventKey="1"
                >
                  Eliminar
                </Dropdown.Item>
                <Dropdown.Item
                 onClick={() => handleLogPlaning(props.row)}
                 eventKey="2">Logs</Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
          );
        },
      },
    ],
    []
  );

  const planingsRef = useRef();

  planingsRef.current = planings;

  const handleDeletePlaning = (rowIndex) => {
    Swal.fire({
      title: "¿Estas seguro (a)?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí!",
      allowOutsideClick: false,
    }).then(async(result) => {
      if (result.isConfirmed) {
        const tokenValid = validToken(logout);
        if (tokenValid) {
          const planingObject = planingsRef.current[rowIndex.id];

          try {
            const response = await axios.delete(
              `http://localhost:8080/api/planing/${planingObject._id}`,
              {
                headers: {
                  "Content-Type": "application/json; charset=utf-8",
                  "Access-Control-Allow-Origin": "*",
                  'x-token':tokenValid
                },
              }
            );
            if(response.status ===200){
              let newPlanings = [...planingsRef.current];
              newPlanings.splice(rowIndex.id, 1);
              setPlanings(newPlanings);
              Swal.fire(
                "¡Eliminada!",
                "Planificación eliminado correctamente",
                "success"
              );
            }
          } catch (error) {
            console.log(error)
          }
        }
      }
    });
  };

  const handleLogPlaning = (rowIndex)=>{
    Swal.fire(
      "¡Información!",
      "Coming soon",
      "success"
    );
  }

  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <ButtonTop />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <BodyTable
              columns={columns}
              data={planings}
              fetchData={fetchData}
              pageCount={pageCount}
            />
            {isLoading && <div>Cargando...</div>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default listPlaning;
