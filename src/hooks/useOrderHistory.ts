"use client";

import { useState, useMemo } from "react";
import { useOrderStore } from "@/store/useOrderStatus";
import { isInRange, DateRange } from "@/components/orders/DateRangeSelector";
import { OrderFilter } from "@/components/orders/OrderFilters";
import { SortOption, sortOrders } from "@/components/orders/OrderSort";

export function useOrderHistory() {
  const allOrders = useOrderStore((s) => s.orders);

  const [dateRange, setDateRange] = useState<DateRange>("today");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [search, setSearch] = useState("");

  const rangedOrders = useMemo(
    () => allOrders.filter((o) => isInRange(new Date(o.createdAt), dateRange)),
    [allOrders, dateRange]
  );

  const counts = useMemo(
    () => ({
      all: rangedOrders.length,
      completed: rangedOrders.filter((o) => o.status === "completed").length,
      voided: rangedOrders.filter((o) => o.status === "voided").length,
    }),
    [rangedOrders]
  );

  const filteredOrders = useMemo(() => {
    const filtered = rangedOrders
      .filter((o) => (filter === "all" ? true : o.status === filter))
      .filter((o) =>
        !search
          ? true
          : o.queueNumber.toLowerCase().includes(search.toLowerCase())
      );
    return sortOrders(filtered, sortBy);
  }, [rangedOrders, filter, search, sortBy]);

  return {
    // data
    rangedOrders,
    filteredOrders,
    counts,
    // filter state
    dateRange,
    sortBy,
    filter,
    search,
    // setters
    setDateRange,
    setSortBy,
    setFilter,
    setSearch,
  };
}