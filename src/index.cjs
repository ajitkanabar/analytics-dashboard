const express = require("express");
const cors = require("cors");
const xlsx = require("xlsx");
const path = require("path");
const sql = require("mssql/msnodesqlv8");
const { format } = require("date-fns");

const app = express();
app.use(cors());

const PORT = 3001;
const filePath = path.join(__dirname, "Power Pivot KPI Dashboard - Ajit.xlsx");

// ✅ SQL CONFIG (Windows Auth + ODBC Driver 18)
const sqlConfig = {
  connectionString:
    "Driver={ODBC Driver 18 for SQL Server};Server=brsqldw;Database=AX2009DataWarehouse;Authentication=ActiveDirectoryIntegrated;Cubes;Trusted_Connection=Yes;TrustServerCertificate=Yes;"
};

// =============================
// 🔁 SQL-powered Comparison API
// =============================
app.get("/api/comparison", async (req, res) => {
  try {
    await sql.connect(sqlConfig);

    const result = await sql.query(`
      SELECT
        CAST([Date] AS DATE) AS InstDate,
        YEAR([Date]) AS [Year],
        DATENAME(MONTH, [Date]) AS [Month],
        DATEPART(WEEK, [Date]) AS [WeekNo],
        DATENAME(WEEKDAY, [Date]) AS [DayName],
        COUNT_BIG(CASE WHEN src = 'Boards Installed' THEN JobNo END) AS [Boards Installed],
        COUNT_BIG(CASE WHEN src = 'Boards Removed' THEN JobNo END) AS [Boards Removed],
        COUNT_BIG(CASE WHEN src = 'Lights Installed' THEN JobNo END) AS [Lights Installed],
        COUNT_BIG(CASE WHEN src = 'Lights Removed' THEN JobNo END) AS [Lights Removed]
      FROM (
        SELECT InstDate AS [Date], JobNo, 'Boards Installed' AS src FROM kpiBoardsInstalledDay
        UNION ALL
        SELECT RemDate AS [Date], JobNo, 'Boards Removed' AS src FROM kpiBoardsRemovedDay
        UNION ALL
        SELECT InstDate AS [Date], JobNo, 'Lights Installed' AS src FROM kpiLightsInstalledDay
        UNION ALL
        SELECT RemDate AS [Date], JobNo, 'Lights Removed' AS src FROM kpiLightsRemovedDay
      ) AS Combined
      WHERE
        [Date] IS NOT NULL
        AND YEAR([Date]) IN (2024, 2025)
      GROUP BY
        CAST([Date] AS DATE),
        YEAR([Date]),
        DATENAME(MONTH, [Date]),
        DATEPART(WEEK, [Date]),
        DATENAME(WEEKDAY, [Date])
      ORDER BY InstDate
    `);

    const rawData = result.recordset;

    const enriched = rawData.map(row => {
      const date = new Date(row.InstDate);
      return {
        ...row,
        month: format(date, "MMM"),
        week: `W${Math.min(4, Math.ceil(date.getDate() / 7))}`,
        day: format(date, "EEE")
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error("SQL Comparison Error:", err);
    res.status(500).json({ error: "Failed to fetch comparison data" });
  }
});

// =============================
// 📊 EXCEL-based API Endpoints
// =============================
function getSheetData(sheetName, range) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet, { range });
}

app.get("/api/summary-kpis", (req, res) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets["Summary"];
    const jsonData = xlsx.utils.sheet_to_json(sheet, {
      range: "K14:AA1095",
      header: 1,
      defval: ""
    });
    res.json(jsonData);
  } catch (err) {
    console.error("Summary KPI error:", err);
    res.status(500).json({ error: "Failed to load summary KPIs" });
  }
});

app.get("/api/credits", (req, res) => {
  try {
    res.json(getSheetData("Credits", "B16:C56"));
  } catch (err) {
    console.error("Credits error:", err);
    res.status(500).json({ error: "Failed to load credits" });
  }
});

app.get("/api/onsites", (req, res) => {
  try {
    res.json(getSheetData("Onsites", "B18:G32"));
  } catch (err) {
    console.error("Onsites error:", err);
    res.status(500).json({ error: "Failed to load onsites data" });
  }
});

app.get("/api/driver-kpi", (req, res) => {
  try {
    res.json(getSheetData("Driver KPI", "B20:AK34"));
  } catch (err) {
    console.error("Driver KPI error:", err);
    res.status(500).json({ error: "Failed to load driver KPI data" });
  }
});

app.get("/api/overtime", (req, res) => {
  try {
    res.json(getSheetData("Overtime", "B14:J26"));
  } catch (err) {
    console.error("Overtime error:", err);
    res.status(500).json({ error: "Failed to load overtime data" });
  }
});

app.get("/api/absentee", (req, res) => {
  res.json({ message: "No data available yet" });
});

app.get("/api/time-on-site", (req, res) => {
  res.json({ message: "No data available yet" });
});

app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
