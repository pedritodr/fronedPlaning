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
      <Table striped bordered hover {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <a className="page-link" onClick={() => previousPage()} disabled={!canPreviousPage}>
            <MdNavigateBefore/>
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" onClick={() => nextPage()} disabled={!canNextPage}>
            <MdNavigateNext/>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default BodyTable;
