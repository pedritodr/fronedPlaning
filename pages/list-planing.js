import { useCallback, useMemo, useState, useRef } from "react";
import { ButtonGroup, DropdownButton, Dropdown } from "react-bootstrap";
import { useRouter } from "next/router";
import BodyTable from "../components/list-planing/BodyTable";
import ButtonTop from "../components/list-planing/ButtonTop";
import Layout from "../layouts/Layout";
import useAuth from "../hooks/useAuth";
import { validToken } from "../utils/validToken";
import axios from "axios";
import Swal from "sweetalert2";

const ListPlaning = () => {
  const month = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const { auth, logout } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [planings, setPlanings] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const router = useRouter();
  if (auth === null) {
    router.replace("/");
    return null;
  }

  const fetchData = useCallback(async function (page) {
    setLoading(true);
    const tokenValid = validToken(logout);
    if (tokenValid) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_END_POINT}planing/paginate/${page + 1}`,
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
          return `${
            month[dateCreate.getMonth()]
          }/${dateCreate.getFullYear()} - ${typeDocument}`;
        },
      },
      {
        Header: "Fecha de planificación",
        accessor: "date_create",
        Cell: (props) => {
          const dateCreatePlaning = new Date(props.row.values.date_create);
          return dateCreatePlaning.toISOString().slice(0, 10);
        },
      },
      {
        Header: "Fecha terminado proceso",
        accessor: (properties) => {
          if (properties.date_culminated !== undefined) {
            const dateCulminated = new Date(properties.date_culminated);
            return `${dateCulminated
              .toISOString()
              .slice(0, 10)} ${dateCulminated.toLocaleTimeString()}`;
          } else {
            return null;
          }
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
        accessor: (properties) => {
          return (
            <ButtonGroup>
              <DropdownButton
                as={ButtonGroup}
                title="Acciones"
                id="bg-nested-dropdown"
                variant="outline-dark"
              >
                {properties.status === 0 && (
                  <Dropdown.Item
                    onClick={() => handleDeletePlaning(properties)}
                    eventKey="1"
                  >
                    Eliminar{" "}
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  onClick={() => handleLogPlaning(properties)}
                  eventKey="2"
                >
                  {" "}
                  Logs{" "}
                </Dropdown.Item>{" "}
              </DropdownButton>{" "}
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        const tokenValid = validToken(logout);
        if (tokenValid) {
          try {
            const responsePlaning = await axios.get(
              `${process.env.NEXT_PUBLIC_END_POINT}planing/${rowIndex._id}`,
              {
                headers: {
                  "Content-Type": "application/json; charset=utf-8",
                  "Access-Control-Allow-Origin": "*",
                  "x-token": tokenValid,
                },
              }
            );
            if (responsePlaning.status === 200) {
              if (responsePlaning.data.status === 0) {
                const response = await axios.delete(
                  `${process.env.NEXT_PUBLIC_END_POINT}planing/${rowIndex._id}`,
                  {
                    headers: {
                      "Content-Type": "application/json; charset=utf-8",
                      "Access-Control-Allow-Origin": "*",
                      "x-token": tokenValid,
                    },
                  }
                );
                if (response.status === 200) {
                  const newPlanings = planingsRef.current.filter(
                    (element) => element._id !== rowIndex._id && element
                  );
                  setPlanings(newPlanings);
                  Swal.fire(
                    "¡Eliminada!",
                    "Planificación eliminado correctamente",
                    "success"
                  );
                }
              } else {
                const newPlanings = planingsRef.current.map((element) => {
                  if (element._id === rowIndex._id) {
                    element.status = 1;
                  }
                  return element;
                });
                setPlanings(newPlanings);
                Swal.fire(
                  "¡Notificación!",
                  "La planificación seleccionada se encuentra en proceso",
                  "info"
                );
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    });
  };

  const handleLogPlaning = async (rowIndex) => {
    const tokenValid = validToken(logout);
    if (tokenValid) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_END_POINT}planing/download/${rowIndex._id}`,
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
              responseType: "blob",
              "x-token": tokenValid,
            },
            onDownloadProgress: (progressEvent) => {
              let percentCompleted = Math.round((progressEvent.loaded * 100) /  progressEvent.total);
              console.log(percentCompleted)
           },
          },
        );
        if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `planing-${rowIndex._id}`);
          document.body.appendChild(link);
          link.click();
          Swal.fire("¡Información!", "Descarga completa", "success");
        }
      } catch (error) {
        console.log(error);
        Swal.fire(
          "¡Información!",
          "No hay logs asociado a esta planificación",
          "info"
        );
      }
    }
  };

  const handleInsert = (valueInsert) => {
    valueInsert.id = planingsRef.current.length;
    const dataNew = [...planingsRef.current, valueInsert];
    setPlanings(dataNew);
  };

  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <ButtonTop insert={handleInsert} />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <BodyTable
              columns={columns}
              data={planings}
              fetchData={()=>fetchData()}
              pageCount={pageCount}
            />
            {isLoading && <div> Cargando... </div>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListPlaning;
