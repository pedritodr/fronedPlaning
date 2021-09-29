import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import useSWR from "swr";
import axios from "axios";

export default function SignupForm() {
  const fetcher = async (url, params) =>
  await axios.post(url, params,{
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin':'*'
    }
  }).then((res) => res.data)

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),
    onSubmit:async (values) => {
        console.log(JSON.stringify(values))
         const resultPetition = await axios.post(
            'http://localhost:8080/api/auth/login',
            JSON.stringify(values),{
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin':'*'
                }
              }
        );
    /*  const { data, error } = useSWR(
        ('http://localhost:8080/api/auth/login', JSON.stringify(values)),
        fetcher
      ); */
      if(resultPetition.status ===200){
        console.log(resultPetition.data)
      }

    },
  });
  const [loading, setLoading] = useState(false);

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
                        aria-describedby="emailHelp"
                        placeholder="Email"
                        name="email"
                        onChange={formik.handleChange}
                        error={formik.errors.email}
                      />
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
                    </div>
                    <div className="mb-3 text-end">
                      <button type="submit" className="btn btn-dark">
                        Login
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
  function initialValues() {
    return {
      email: "",
      password: "",
    };
  }

  function validationSchema() {
    return {
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    };
  }
}
