import { useState, useCallback } from "react";

export function useTableState(initialSortField = "user_id", initialSortDir = "desc") {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDir, setSortDir] = useState(initialSortDir);

  const paging = { page, pageSize, setPage, setPageSize, count, setCount };
  const sorting = { sortField, sortDir, setSortField, setSortDir };

  const fetchTable = useCallback(async (url) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);
    params.append("sortBy", sortField);
    params.append("sortDir", sortDir);
    if (query) params.append("q", query);

    const res = await fetch(`${url}?${params}`);

    if (!res.ok) {
      console.error("Request: ", `${url}?${params}`);
      console.error("Response: ", res);
      console.error("Text: ", await res.text());

      throw new Error(`Could not get data!`)
    }

    const { data, count } = await res.json();

    setCount(count);

    return data;
  }, [page, pageSize, sortField, sortDir, query]);

  return { paging, sorting, query, setQuery, fetchTable };
}

