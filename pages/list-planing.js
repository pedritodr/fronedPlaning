import { useRouter } from "next/router";
import BodyTable from "../components/list-planing/BodyTable";
import ButtonTop from "../components/list-planing/ButtonTop";
import Layout from "../layouts/Layout";
import useAuth from "../hooks/useAuth";

const listPlaning = () => {
  const { auth } = useAuth();
  const router = useRouter();
  if (auth === null) {
    router.replace("/");
    return null;
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
            <BodyTable />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default listPlaning;
