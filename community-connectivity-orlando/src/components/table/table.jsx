import { Pagination, Table } from "react-bootstrap";

import styles from "./table.module.scss";

export default function CustomTable({ data, columns, paging }) {
  if (!data || !columns || !paging) {
    return (
      <div className="text-center text-light my-4">
        <span className="spinner-border text-warning"></span>
        <p>Loading table...</p>
      </div>
    );
  }

  const { enabled, page, pageSize, setPage, setPageSize } = paging;

  return (
    <div className={`${styles["table-container"]}`}>
      <Table>
        <thead>
          <tr>
            {columns.map((c, k) => (<th key={k}>{c.text}</th>))}
          </tr>
        </thead>
        <tbody>
          {data.map((datum, k) => (
            <tr key={k}>
              {columns.map((c, k2) => {
                return (!c.formatter) ? (<td key={k2}>{datum[c.dataField]}</td>) : c.formatter(datum)
              })}
            </tr>
          ))}
        </tbody>
      </Table>
      {enabled &&
        <Pagination>
          <Pagination.First />
          <Pagination.Prev />
          <input value={page} type="number" onChange={(x) => setPage(x.value)} />
          <Pagination.Next />
          <Pagination.Last />
          <br />
          <div>
            <label>Page size: </label>
            <select value={pageSize} onChange={x => setPageSize(x.value)}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={1000}>1000</option>
            </select>
          </div>
        </Pagination>
      }
    </div>
  )
}

