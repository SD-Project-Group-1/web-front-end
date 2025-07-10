import { Button, Pagination, Table } from "react-bootstrap";

import styles from "./customTable.module.scss";

export default function CustomTable({ data, columns, paging, sorting }) {
  const changeSort = (field) => {
    if (sortField === field && sortDir === "asc") {
      setSortDir("desc");
    }
    else if (sortField === field) {
      setSortDir("asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  if (!data || !columns || !paging || !sorting) {
    return (
      <div className="text-center text-light my-4">
        <span className="spinner-border text-warning"></span>
        <p>Loading table...</p>
      </div>
    );
  }

  const { page, pageSize, setPage, setPageSize } = paging;
  const { sortField, sortDir, setSortField, setSortDir } = sorting;

  return (
    <div className={`${styles["table-container"]}`}>
      <Table>
        <thead>
          <tr>
            {columns.map((c, k) =>
            (<th key={k} >
              <div>
                {c.text}
                {sorting.enabled && (
                  sortField === c.dataField && (
                    <Button onClick={() => changeSort(c.dataField)}>{sortDir}</Button>
                  ) || (
                    <Button onClick={() => changeSort(c.dataField)}>
                      --
                    </Button>
                  )
                )}
              </div>
            </th>))}
          </tr>
        </thead>
        <tbody>
          {data.map((datum, k) => (
            <tr key={k}>
              {columns.map((c, k2) => <td key={k2}>{(!c.formatter) ? (datum[c.dataField]) : c.formatter(datum)}</td>)}
            </tr>
          ))}
        </tbody>
      </Table>
      {paging.enabled &&
        <div className={`${styles.pagination}`}>
          <Pagination>
            <Pagination.First className={`${styles.first}`} onClick={() => setPage(1)} />
            <Pagination.Prev onClick={() => setPage(page > 1 ? page - 1 : 1)} />
            <input value={page} type="number" onChange={(x) => setPage(x.target.value)} />
            <Pagination.Next onClick={() => setPage(page + 1)} />
            <Pagination.Last className={`${styles.last}`} />
            <br />
            <div className={`${styles.select}`}>
              <label>Page size: </label>
              <select value={pageSize} onChange={x => setPageSize(x.target.value)}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={1000}>1000</option>
              </select>
            </div>
          </Pagination>
        </div>
      }
    </div>
  )
}

