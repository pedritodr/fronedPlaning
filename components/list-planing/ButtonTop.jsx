import { useState } from "react";
import { DateRange } from "react-date-range";
// Require Esperanto locale
import { es } from "date-fns/locale";
import Swal from "sweetalert2";
import axios from "axios";
import { useForm } from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import { validToken } from "../../utils/validToken";
import { Form, Row, Button, Modal, Spinner } from "react-bootstrap";

const ButtonTop = () => {
  const calendarInitial = [
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ];

  const { auth, logout } = useAuth();

  const [show, setShow] = useState(false);

  const [calendar, setCalendar] = useState(calendarInitial);

  const [loading, setLoading] = useState(false);

  const [formValues, handleInputChange, reset] = useForm({
    typeFile: "00",
    outFormat: 0,
  });

  const { typeFile, outFormat } = formValues;

  const [fileCsv, setFileCsv] = useState({selectedFile: null});

  const handleClose = () => setShow(false);

  const handleShow = () => {
    reset;
    setCalendar(calendarInitial);
    setShow(true);
    setFileCsv({selectedFile: null});
  };


  const handleFileCsv = event => {
    setFileCsv({selectedFile: event.target.files[0]});
    console.log('change')
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (calendar[0].startDate === null) {
      return Swal.fire(
        "Notificación",
        "La fecha de inicio es obligatoria",
        "error"
      );
    }

    if (calendar[0].endDate === null) {
      return Swal.fire(
        "Notificación",
        "La fecha de fin es obligatoria",
        "error"
      );
    }

    const dateBegin = new Date(calendar[0].startDate);
    const dateEnd = new Date(calendar[0].endDate);

    if (dateBegin.toISOString().slice(0, 10) === dateEnd.toISOString().slice(0, 10)) {
      return Swal.fire(
        "Notificación",
        "Las fechas no pueden ser iguales",
        "error"
      );
    }

    if (dateBegin.getFullYear() !== dateEnd.getFullYear()) {
      return Swal.fire(
        "Notificación",
        "Las fechas no se encuentran en el mismo rango",
        "error"
      );
    }

    if (outFormat === 0) {
      return Swal.fire(
        "Notificación",
        "El formato de salida es obligatorio",
        "error"
      );
    }

    if (typeFile === "00") {
      return Swal.fire(
        "Notificación",
        "El tipo de documento es obligatorio",
        "error"
      );
    }

    if (fileCsv.selectedFile === null) {
      return Swal.fire("Notificación", "El secuencial es obligarorio", "error");
    }

    const fileSplit = fileCsv.selectedFile.name.split(".");
    const extFile = fileSplit[fileSplit.length - 1];
    if (extFile !== 'csv') {
      setFileCsv({selectedFile: null});
      return Swal.fire(
        "Notificación",
        "El archivo no corresponde a un formato (*.csv)",
        "error"
      );
    }
    const tokenValid = validToken(logout);
    setLoading(true);
    if (tokenValid) {
      const data = new FormData()
      data.append('date_begin',dateBegin.toISOString().slice(0, 10));
      data.append('date_end',dateEnd.toISOString().slice(0, 10));
      data.append('output_format',outFormat);
        data.append('document_type',typeFile);
        data.append('user', auth.idUser);
        data.append('secuential',fileCsv.selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:8080/api/planing",
          data,
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
              "x-token": tokenValid,
            },
          }
        );
        if (response.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Correcto",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            handleClose();
          }, 1500);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        Swal.fire(
          "Notificación",
          "Problemas en los datos del formulario",
          "error"
        );
      }
    }
  };

  return (
    <>
      <div className="row mt-3">
        <div className="col-12">
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              className="btn btn-outline-primary btn-lg me-md-2"
              type="button"
            >
              Descargar plantilla
            </button>
            <button
              className="btn btn-outline-info btn-lg"
              type="button"
              onClick={handleShow}
            >
              Crear planificación
            </button>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header>
            <Modal.Title>Adicionar programación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <div className="col-6">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => {
                    setCalendar([item.selection]);
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={calendar}
                  locale={es}
                />
              </div>
              <div className="col-6">
                <div className="row">
                  <div className="mb-3 mt-2">
                    <select
                      className="form-select"
                      name="outFormat"
                      value={outFormat}
                      onChange={handleInputChange}
                    >
                      <option value={0}>Formato de salida (XML ó PDF)</option>
                      <option value={1}>XML</option>
                      <option value={2}>PDF</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      name="typeFile"
                      value={typeFile}
                      onChange={handleInputChange}
                    >
                      <option value={"00"}>Tipo de documento</option>
                      <option value={"01"}>Factura</option>
                      <option value={"03"}>Liquidación de Compras</option>
                      <option value={"04"}>Nota de Crédito</option>
                      <option value={"05"}>Nota Débito</option>
                      <option value={"06"}>Guía de Remisión</option>
                      <option value={"07"}>Comprobante de Retención</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">
                      Secuencial (*.csv)
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      id="formFile"
                      name="fileCsv"
                      onChange={handleFileCsv}
                    />
                  </div>
                </div>
              </div>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="dark">
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : null}
              <span> Programar ahora</span>
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ButtonTop;
