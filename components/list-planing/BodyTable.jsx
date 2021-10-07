import { useEffect } from "react";
import { useTable, usePagination } from "react-table";
import { Table } from "react-bootstrap";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

const BodyTable = ({
  data,
  fetchData,
  columns,
  pageCount: controlledPageCount,
} = props) => {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    usePagination
  );

  const {
    canPreviousPage,
    canNextPage,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = tableInstance;
  useEffect(() => {
    fetchData(pageIndex);
  }, [pageIndex, fetchData]);
  return (
    <div>
      {rows.length > 0 ? (
        <Table striped bordered hover {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup,i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={i} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row,i) => {
              prepareRow(row);
              return (
                <tr key={i} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td key={i} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <h1 className="text-center">No hay planificaciones creadas</h1>
      )}
      {rows.length > 0 && pageCount >1? (
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a
                className="page-link"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <MdNavigateBefore />
              </a>
            </li>
            <li className="page-item">
              <a
                className="page-link"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <MdNavigateNext />
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
};

export default BodyTable;
