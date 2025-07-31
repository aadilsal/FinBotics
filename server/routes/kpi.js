import express from "express";
import KPI from "../models/KPI.js";

const router = express.Router();
router.get("/kpis", async (req, res) => {
  try {
    const kpis = await KPI.find();
    res.status(200).json(kpis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post("/kpis", async (req, res) => {
  try {
    const {
      totalProfit,
      totalRevenue,
      totalExpenses,
      expensesByCategory,
      monthlyData,
      dailyData,
    } = req.body;
    if (
      !totalProfit ||
      !totalRevenue ||
      !totalExpenses ||
      !expensesByCategory ||
      !monthlyData ||
      !dailyData
    ) {
      return res.status(400).json({ message: "All KPI fields are required." });
    }
    const kpi = new KPI({
      totalProfit,
      totalRevenue,
      totalExpenses,
      expensesByCategory,
      monthlyData,
      dailyData,
    });
    await kpi.save();
    res.status(201).json(kpi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
