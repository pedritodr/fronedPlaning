import {  useState } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Alert, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import axios from "axios";

import useAuth from "../../hooks/useAuth";

const [loading, setLoading] = useState(false);

const validationSchema = () => {
  return Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email required"),
    password: Yup.string().required("Password required"),
  });
};

const initialValues = () => {
  return {
    email: "",
    password: "",
  };
};

export default function SignupForm() {
  const router = useRouter();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
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
      }
    },
  });



  return (
    <>
      <div className="container">
        <div className="row">
          <div className="Absolute-Center is-Responsive mx-auto">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.email}
                      />
                      {formik.errors.email ? (
                        <Alert variant="danger">{formik.errors.email}</Alert>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        onChange={formik.handleChange}
                        error={formik.errors.password}
                      />
                      {formik.errors.password ? (
                        <Alert variant="danger">{formik.errors.password}</Alert>
                      ) : null}
                    </div>
                    <div className="mb-3 text-end">
                      <button type="submit" className="btn btn-dark">
                        {loading ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : null}
                        <span> Login</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
