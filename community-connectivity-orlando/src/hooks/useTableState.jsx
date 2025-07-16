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

  return { paging, sorting, query, setQuery };
}

