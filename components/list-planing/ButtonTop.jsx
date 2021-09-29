import { useState } from "react";
import { DateRange } from "react-date-range";
//import { Modal, Button } from "react-bootstrap";

import { Form, Row, Col, Button, Modal } from "react-bootstrap";
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

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
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
        <Modal.Header>
          <Modal.Title>Adicionar programación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <div className="col-6">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setState([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={state}
                />
              </div>
              <div className="col-6">
                <div className="row">
                  <div className="mb-3 mt-2">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                    >
                      <option selected>Formato de salida (XML ó PDF)</option>
                      <option value={1}>One</option>
                      <option value={2}>Two</option>
                      <option value={3}>Three</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                    >
                      <option selected>Tipo de documento</option>
                      <option value={1}>One</option>
                      <option value={2}>Two</option>
                      <option value={3}>Three</option>
                    </select>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="dark">Programar ahora</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ButtonTop;
