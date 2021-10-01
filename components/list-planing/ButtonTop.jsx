import { useState } from "react";
import { DateRange } from "react-date-range";
// Require Esperanto locale
import { es } from "date-fns/locale";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";

import { Form, Row, Col, Button, Modal,FormControl, FloatingLabel, Alert, Spinner, } from "react-bootstrap";
const ButtonTop = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const validationSchema = (values) => {
    const errors = {};
    console.log(values);
    if (!values.outFormat) {
      errors.outFormat = "Required";
    } else if (values.firstName.length > 15) {
      errors.outFormat = "Must be 15 characters or less";
    }

    if (!values.lastName) {
      errors.lastName = "Required";
    } else if (values.lastName.length > 20) {
      errors.lastName = "Must be 20 characters or less";
    }

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    return errors;
  };

  const initialValues = () => {
    return {
      email: "",
      password: "",
    };
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      /*  try {
        const resultPetition = await axios.post(
          "http://localhost:8080/api/auth/login",
          JSON.stringify(values),
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        if (resultPetition.status === 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Correcto',
            showConfirmButton: false,
            timer: 1500
          })
          login(resultPetition.data.token);
          setTimeout(() => {
           router.push("/list-planing");
          }, 1500);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Swal.fire(
          "Notificación",
          "El usuario o la contraseña no son correctos",
          "error"
        );
      } */
    },
  });

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
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Header>
            <Modal.Title>Adicionar programación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <div className="col-6">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => {
                    setState([item.selection]);
                    console.log(state);
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={state}
                  locale={es}
                  /*    dateDisplayFormat={'yyyy-MM-LL'} */
                />
              </div>
              <div className="col-6">
              <Row className="mb-3">
    <Form.Group as={Col} controlId="formGridCity">
      <Form.Label>City</Form.Label>
      <Form.Control />
    </Form.Group>



    <Form.Group as={Col} controlId="formGridZip">
      <Form.Label>Zip</Form.Label>
      <Form.Control />
    </Form.Group>
  </Row>
                <div className="row">

                  <div className="mb-3 mt-2">


                  {/*   <select
                      className="form-select"
                      name="outFormat"
                      value={formik.values.outFormat}
                      onChange={formik.handleChange}
                      defaultValue={0}
                    >
                      <option selected value={0}>
                        Formato de salida (XML ó PDF)
                      </option>
                      <option value={1}>XML</option>
                      <option value={2}>PDF</option>
                    </select> */}
                    {formik.errors.outFormat && touched.color && (
                      <div className="alert alert-danger" role="alert">
                        {errors.outFormat}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                  {/*   <select
                      className="form-select"
                      aria-label="Default select example"
                    >
                      <option selected>Tipo de documento</option>
                      <option value={"01"}>Factura</option>
                      <option value={"03"}>Liquidación de Compras</option>
                      <option value={"04"}>Nota de Crédito</option>
                      <option value={"05"}>Nota Débito</option>
                      <option value={"06"}>Guía de Remisión</option>
                      <option value={"07"}>Comprobante de Retención</option>
                    </select> */}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">
                      Secuencial (*.csv)
                    </label>
                    <input className="form-control" type="file" id="formFile" />
                  </div>
                </div>
              </div>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="dark">Programar ahora</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ButtonTop;
