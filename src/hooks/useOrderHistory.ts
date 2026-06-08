"use client";

import { useState, useEffect } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { DateRange } from "@/components/orders/DateRangeSelector";
import { OrderFilter } from "@/components/orders/OrderFilters";
import { SortOption, sortOrders } from "@/components/orders/OrderSort";

// Map FE DateRange → BE period param
const mapPeriod = (range: DateRange): string => {
  switch (range) {
    case "today": return "today";
    case "7days": return "7d";
    case "30days": return "30d";
    case "90days": return "90d";
    default: return "today";
  }
};

export function useOrderHistory() {
  const orders = useOrderStore((s) => s.orders);
  const stats = useOrderStore((s) => s.stats);
  const isLoading = useOrderStore((s) => s.isLoading);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const fetchStats = useOrderStore((s) => s.fetchStats);

  const [dateRange, setDateRange] = useState<DateRange>("today");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [search, setSearch] = useState("");

  // Fetch orders + stats kalo filter berubah
  useEffect(() => {
    const period = mapPeriod(dateRange);
    const params: { period: string; status?: string; search?: string } = { period };
    if (filter !== "all") params.status = filter;
    if (search) params.search = search;

    fetchOrders(params);
    fetchStats(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, filter, search]);

  // Counts dari stats (BE-side calc, akurat)
  const counts = {
    all: (stats?.total_orders ?? 0) + (stats?.voided_count ?? 0),
    completed: stats?.total_orders ?? 0,
    voided: stats?.voided_count ?? 0,
  };

  // Client-side sort (cheap)
  const filteredOrders = sortOrders(orders, sortBy);

  return {
    // data
    rangedOrders: orders,
    filteredOrders,
    counts,
    stats,
    isLoading,
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