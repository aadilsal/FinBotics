import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
} from "./types";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Products", "Transactions"],
  endpoints: (build) => ({
    //key performae indicators
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query: () => "kpi/kpis/",
      providesTags: ["Kpis"],
    }),
    getProducts: build.query<Array<GetProductsResponse>, void>({
      query: () => "product/products/",
      providesTags: ["Products"],
    }),
    getTransactions: build.query<Array<GetTransactionsResponse>, void>({
      query: () => "transaction/transactions/",
      providesTags: ["Transactions"],
    }),
    addProduct: build.mutation<any, { price: string; expense: string }>({
      query: (body) => ({
        url: "product/products/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),
    addTransaction: build.mutation<
      any,
      { buyer: string; amount: string; productIds: string[] }
    >({
      query: (body) => ({
        url: "transaction/transactions/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Transactions"],
    }),
    addKpi: build.mutation<any, any>({
      query: (body) => ({
        url: "kpi/kpis/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Kpis"],
    }),
  }),
});

export const {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
  useAddProductMutation,
  useAddTransactionMutation,
  useAddKpiMutation,
} = api;
