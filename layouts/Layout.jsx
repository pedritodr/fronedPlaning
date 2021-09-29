import NavbarMain from "../components/NavbarMain";

export default function Layout(props) {
  const { children } = props;

  return (
    <>
      <div className="container-fluid">
      <NavbarMain />

        <div className="container-fluid">
          <div className="row">
          <div className="col-12">
          {children}
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
