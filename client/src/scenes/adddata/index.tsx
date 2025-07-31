import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import BoxHeader from "@/components/BoxHeader";
import { useNavigate } from "react-router-dom";
import {
  useAddProductMutation,
  useAddTransactionMutation,
  useAddKpiMutation,
  useGetProductsQuery,
} from "@/state/api";
import type { ChangeEvent, SyntheticEvent } from "react";

const AddData = () => {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  // Product state
  const [product, setProduct] = useState({ price: "", expense: "" });
  // Transaction state
  const [transaction, setTransaction] = useState<{
    buyer: string;
    amount: string;
    productIds: string[];
  }>({
    buyer: "",
    amount: "",
    productIds: [],
  });
  // KPI state
  const [kpi, setKpi] = useState({
    totalProfit: "",
    totalRevenue: "",
    totalExpenses: "",
    expensesByCategory: { salaries: "", supplies: "", services: "" },
    monthlyData: [
      {
        month: "",
        revenue: "",
        expenses: "",
        operationalExpenses: "",
        nonOperationalExpenses: "",
      },
    ],
    dailyData: [{ date: "", revenue: "", expenses: "" }],
  });
  const { data: products } = useGetProductsQuery();
  const [addProduct] = useAddProductMutation();
  const [addTransaction] = useAddTransactionMutation();
  const [addKpi] = useAddKpiMutation();
  const [success, setSuccess] = useState("");

  const handleTabChange = (_e: SyntheticEvent, newValue: number) =>
    setTab(newValue);

  const handleProductChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setProduct({ ...product, [e.target.name]: e.target.value });
  const handleTransactionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setTransaction({ ...transaction, [e.target.name]: e.target.value });
  const handleTransactionProductIds = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setTransaction({
      ...transaction,
      productIds: Array.isArray(value) ? (value as string[]) : [value],
    });
  };
  const handleKpiChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setKpi({ ...kpi, [e.target.name]: e.target.value });
  const handleKpiCategoryChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setKpi({
      ...kpi,
      expensesByCategory: {
        ...kpi.expensesByCategory,
        [e.target.name]: e.target.value,
      },
    });

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct(product).unwrap();
    setSuccess("Product added!");
    setTimeout(() => navigate("/"), 1000);
  };
  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTransaction({
      ...transaction,
      productIds: transaction.productIds,
    }).unwrap();
    setSuccess("Transaction added!");
    setTimeout(() => navigate("/"), 1000);
  };
  const handleKpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addKpi(kpi).unwrap();
    setSuccess("KPI added!");
    setTimeout(() => navigate("/"), 1000);
  };

  const whiteTextFieldProps = {
    sx: {
      input: { color: "white" },
      label: { color: "white" },
      "& .MuiInputLabel-root": { color: "white" },
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "white" },
        "&:hover fieldset": { borderColor: "white" },
        "&.Mui-focused fieldset": { borderColor: "white" },
      },
    },
    InputLabelProps: { style: { color: "white" } },
  };

  return (
    <DashboardBox width="100%" height="100%" p="2rem">
      <BoxHeader
        title="Add Data"
        subtitle="Insert Product, Transaction, or KPI"
      />
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Product" />
        <Tab label="Transaction" />
        <Tab label="KPI" />
      </Tabs>
      {success && <Typography color="success.main">{success}</Typography>}
      {tab === 0 && (
        <form onSubmit={(e: React.FormEvent) => handleProductSubmit(e)}>
          <FlexBetween gap="1rem" mb={2}>
            <TextField
              label="Price (USD)"
              name="price"
              value={product.price}
              onChange={handleProductChange}
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Expense (USD)"
              name="expense"
              value={product.expense}
              onChange={handleProductChange}
              required
              {...whiteTextFieldProps}
            />
          </FlexBetween>
          <Button type="submit" variant="contained" color="primary">
            Add Product
          </Button>
        </form>
      )}
      {tab === 1 && (
        <form onSubmit={(e: React.FormEvent) => handleTransactionSubmit(e)}>
          <FlexBetween gap="1rem" mb={2}>
            <TextField
              label="Buyer"
              name="buyer"
              value={transaction.buyer}
              onChange={handleTransactionChange}
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Amount (USD)"
              name="amount"
              value={transaction.amount}
              onChange={handleTransactionChange}
              required
              {...whiteTextFieldProps}
            />
            <TextField
              select
              label="Product(s)"
              name="productIds"
              SelectProps={{ multiple: true }}
              value={transaction.productIds}
              onChange={handleTransactionProductIds}
              required
              sx={{ minWidth: 200, ...whiteTextFieldProps.sx }}
              InputLabelProps={whiteTextFieldProps.InputLabelProps}
            >
              {products &&
                products.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p._id}
                  </MenuItem>
                ))}
            </TextField>
          </FlexBetween>
          <Button type="submit" variant="contained" color="primary">
            Add Transaction
          </Button>
        </form>
      )}
      {tab === 2 && (
        <form onSubmit={(e: React.FormEvent) => handleKpiSubmit(e)}>
          <FlexBetween gap="1rem" mb={2}>
            <TextField
              label="Total Profit (USD)"
              name="totalProfit"
              value={kpi.totalProfit}
              onChange={handleKpiChange}
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Total Revenue (USD)"
              name="totalRevenue"
              value={kpi.totalRevenue}
              onChange={handleKpiChange}
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Total Expenses (USD)"
              name="totalExpenses"
              value={kpi.totalExpenses}
              onChange={handleKpiChange}
              required
              {...whiteTextFieldProps}
            />
          </FlexBetween>
          <Typography variant="h6" mt={2}>
            Expenses By Category
          </Typography>
          <FlexBetween gap="1rem" mb={2}>
            <TextField
              label="Salaries"
              name="salaries"
              value={kpi.expensesByCategory.salaries}
              onChange={handleKpiCategoryChange}
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Supplies"
              name="supplies"
              value={kpi.expensesByCategory.supplies}
              onChange={handleKpiCategoryChange}
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Services"
              name="services"
              value={kpi.expensesByCategory.services}
              onChange={handleKpiCategoryChange}
              required
              {...whiteTextFieldProps}
            />
          </FlexBetween>
          <Typography variant="h6" mt={2}>
            Monthly Data (first only)
          </Typography>
          <FlexBetween gap="1rem" mb={2}>
            <TextField
              label="Month"
              name="month"
              value={kpi.monthlyData[0].month}
              onChange={(
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                setKpi({
                  ...kpi,
                  monthlyData: [
                    { ...kpi.monthlyData[0], month: e.target.value },
                  ],
                })
              }
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Revenue (USD)"
              name="revenue"
              value={kpi.monthlyData[0].revenue}
              onChange={(
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                setKpi({
                  ...kpi,
                  monthlyData: [
                    { ...kpi.monthlyData[0], revenue: e.target.value },
                  ],
                })
              }
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Expenses (USD)"
              name="expenses"
              value={kpi.monthlyData[0].expenses}
              onChange={(
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                setKpi({
                  ...kpi,
                  monthlyData: [
                    { ...kpi.monthlyData[0], expenses: e.target.value },
                  ],
                })
              }
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Operational Expenses (USD)"
              name="operationalExpenses"
              value={kpi.monthlyData[0].operationalExpenses}
              onChange={(
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                setKpi({
                  ...kpi,
                  monthlyData: [
                    {
                      ...kpi.monthlyData[0],
                      operationalExpenses: e.target.value,
                    },
                  ],
                })
              }
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Non-Operational Expenses (USD)"
              name="nonOperationalExpenses"
              value={kpi.monthlyData[0].nonOperationalExpenses}
              onChange={(
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                setKpi({
                  ...kpi,
                  monthlyData: [
                    {
                      ...kpi.monthlyData[0],
                      nonOperationalExpenses: e.target.value,
                    },
                  ],
                })
              }
              required
              {...whiteTextFieldProps}
            />
          </FlexBetween>
          <Typography variant="h6" mt={2}>
            Daily Data (first only)
          </Typography>
          <FlexBetween gap="1rem" mb={2}>
            <TextField
              label="Date"
              name="date"
              value={kpi.dailyData[0].date}
              onChange={(
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                setKpi({
                  ...kpi,
                  dailyData: [{ ...kpi.dailyData[0], date: e.target.value }],
                })
              }
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Revenue (USD)"
              name="revenue"
              value={kpi.dailyData[0].revenue}
              onChange={(
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                setKpi({
                  ...kpi,
                  dailyData: [{ ...kpi.dailyData[0], revenue: e.target.value }],
                })
              }
              required
              {...whiteTextFieldProps}
            />
            <TextField
              label="Expenses (USD)"
              name="expenses"
              value={kpi.dailyData[0].expenses}
              onChange={(
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                setKpi({
                  ...kpi,
                  dailyData: [
                    { ...kpi.dailyData[0], expenses: e.target.value },
                  ],
                })
              }
              required
              {...whiteTextFieldProps}
            />
          </FlexBetween>
          <Button type="submit" variant="contained" color="primary">
            Add KPI
          </Button>
        </form>
      )}
    </DashboardBox>
  );
};

export default AddData;
