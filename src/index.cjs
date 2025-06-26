const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');
const path = require('path');
const sql = require('mssql/msnodesqlv8');
const { format, startOfWeek, endOfWeek } = require('date-fns');

const app = express();
const PORT = 3001;

app.use(cors());

const filePath = path.join(__dirname, 'Power Pivot KPI Dashboard - Ajit.xlsx');

const sqlConfig = {
  connectionString:
    'Driver={ODBC Driver 18 for SQL Server};' +
    'Server=brsqldw;' +
    'Database=AX2009DataWarehouse;' +
    'Authentication=ActiveDirectoryIntegrated;' +
    'Cubes;' +
    'Trusted_Connection=Yes;' +
    'TrustServerCertificate=Yes;'
};

/* === SQL-powered API === */
app.get('/api/comparison', async (req, res) => {
  try {
    await sql.connect(sqlConfig);

    const query = `
      SELECT
        CAST([Date] AS DATE) AS InstDate,
        YEAR([Date]) AS [Year],
        DATENAME(MONTH, [Date]) AS [Month],
        DATEPART(WEEK, [Date]) AS [WeekNo],
        DATENAME(WEEKDAY, [Date]) AS [DayName],
        COUNT_BIG(CASE WHEN src = 'Boards Installed' THEN JobNo END) AS [Boards Installed],
        COUNT_BIG(CASE WHEN src = 'Boards Removed'  THEN JobNo END) AS [Boards Removed],
        COUNT_BIG(CASE WHEN src = 'Lights Installed' THEN JobNo END) AS [Lights Installed],
        COUNT_BIG(CASE WHEN src = 'Lights Removed'  THEN JobNo END) AS [Lights Removed]
      FROM (
        SELECT InstDate AS [Date], JobNo, 'Boards Installed'  AS src FROM kpiBoardsInstalledDay
        UNION ALL
        SELECT RemDate  AS [Date], JobNo, 'Boards Removed'    AS src FROM kpiBoardsRemovedDay
        UNION ALL
        SELECT InstDate AS [Date], JobNo, 'Lights Installed'  AS src FROM kpiLightsInstalledDay
        UNION ALL
        SELECT RemDate  AS [Date], JobNo, 'Lights Removed'    AS src FROM kpiLightsRemovedDay
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
      ORDER BY InstDate;
    `;

    const rows = (await sql.query(query)).recordset;

    const enriched = rows.map(r => {
      const d = new Date(r.InstDate);
      return {
        ...r,
        month: format(d, 'MMM'),
        week: `W${Math.min(4, Math.ceil(d.getDate() / 7))}`,
        day: format(d, 'EEE')
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('SQL Comparison Error:', err);
    res.status(500).json({ error: 'Failed to fetch comparison data' });
  }
});

function getSheetData(sheetName, range) {
  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet, { range });
}

/* === Summary Excel tab === */
/* === Unified Summary API (like comparison) === */
app.get('/api/summary', async (req, res) => {
  try {
    await sql.connect(sqlConfig);

    const result = await sql.query(`
      SELECT 
        CONVERT(date, OrdDate) AS [Date],
        ReqType,
        JobNo,
        JobName,
        JobDesc,
        CompanyName,
        Driver,
        OnsiteDetails,
        JobNoOriginal
      FROM kpiOnSitesDay
      WHERE 
        ReqType IS NOT NULL
        AND LTRIM(RTRIM(ReqType)) <> ''
        AND OrdDate >= '2025-01-01'
      ORDER BY OrdDate DESC;
    `);

    const enriched = result.recordset.map(row => {
      const d = new Date(row.Date);
      const startDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay(); // 0 = Sun, 1 = Mon
      const offset = startDay === 0 ? 6 : startDay - 1;
      const week = `W${Math.ceil((d.getDate() + offset) / 7)}`;

      return {
        ...row,
        year: d.getFullYear(),
        month: d.toLocaleString('en-AU', { month: 'short' }), // 'Jan', 'Feb', etc.
        week,
        day: d.toLocaleDateString('en-AU', { weekday: 'short' }) // 'Mon', 'Tue'
      };
    });

    console.log('📦 /api/summary → rows:', enriched.length);
    res.json(enriched);
  } catch (err) {
    console.error('❌ Summary API failed:', err);
    res.status(500).json({ error: 'Failed to load summary data' });
  }
});






/* === CREDITS API === */
app.get('/api/credits', (req, res) => {
  try {
    const wb = xlsx.readFile(path.join(__dirname, 'CreditsCopy.xlsx'));
    const sheet = wb.Sheets['Credits'];
    if (!sheet) return res.status(404).send('Sheet not found');

    const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    // Diagnostic: print column names in the first row
    console.log('🧾 Available columns in first row:', Object.keys(data[0]));

    // Diagnostic: Check if 'request received' exists in first few rows
    for (let i = 0; i < Math.min(5, data.length); i++) {
      console.log(`Row ${i + 1} → request received =`, data[i]?.['request received']);
    }

    const parseExcelDate = (excelDate) => {
      if (typeof excelDate === 'number') {
        const jsDate = xlsx.SSF.parse_date_code(excelDate);
        if (!jsDate || !jsDate.y || !jsDate.m || !jsDate.d) return null;
        return new Date(Date.UTC(jsDate.y, jsDate.m - 1, jsDate.d));
      } else if (typeof excelDate === 'string') {
        const parts = excelDate.split(/[\/\-]/);
        if (parts.length === 3) {
          const [day, month, year] = parts.map(p => p.padStart(2, '0'));
          return new Date(`${year}-${month}-${day}`);
        }
      }
      return null;
    };

    const getWeekOfMonth = (date) => `W${Math.min(5, Math.ceil(date.getDate() / 7))}`;
    const getWeekRange = (date) => {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = endOfWeek(date, { weekStartsOn: 1 });
      return {
        weekStart: format(start, 'd MMM'),
        weekEnd: format(end, 'd MMM'),
      };
    };

    const groupedAmount = {};
    const groupedCount = {};
    const departments = new Set();
    const months = new Set();
    const weeksPerMonth = {};
    const rawData = [];

    for (const row of data) {
      const rawDate = row['request received'];
      const date = parseExcelDate(rawDate);
      const amount = parseFloat(row['amount to credit']) || 0;

      if (!date || date.getFullYear() !== 2025 || amount <= 0) continue;

      const month = format(date, 'MMM');
      const week = getWeekOfMonth(date);
      const { weekStart, weekEnd } = getWeekRange(date);
      const department = String(row.Department || '').trim();
      const client = String(row.Client || '').trim();
      const job = String(row.Job || '').trim();
      const reason = String(row.Reason || '').trim();
      const key = `${month}__${week}__${department}`;

      groupedAmount[key] = (groupedAmount[key] || 0) + amount;
      groupedCount[key] = (groupedCount[key] || 0) + 1;

      rawData.push({
        Client: client,
        Department: department,
        Job: job,
        Reason: reason,
        'Credit Amount': Math.round(amount),
        'Request Received': date.toISOString().split('T')[0],
        Month: month,
        Week: week,
        WeekRange: `${weekStart} to ${weekEnd}`
      });

      months.add(month);
      departments.add(department);
      if (!weeksPerMonth[month]) weeksPerMonth[month] = {};
      weeksPerMonth[month][week] = { weekStart, weekEnd };
    }

    const amountData = Object.entries(groupedAmount).map(([key, value]) => {
      const [month, week, dept] = key.split('__');
      return { month, week, day: dept, value: Math.round(value) };
    });

    const countData = Object.entries(groupedCount).map(([key, value]) => {
      const [month, week, dept] = key.split('__');
      return { month, week, day: dept, value };
    });

    res.json({
      months: ['All', ...Array.from(months).sort()],
      weeksPerMonth,
      departments: Array.from(departments).sort(),
      amountData,
      countData,
      rawData
    });
  } catch (err) {
    console.error('❌ Credits API error:', err);
    res.status(500).json({ error: 'Failed to load credits data' });
  }
});


/* === Other Excel Endpoints === */
app.get('/api/onsites',       (req,res)=> res.json(getSheetData('Onsites',    'B18:G32')));
app.get('/api/driver-kpi',    (req,res)=> res.json(getSheetData('Driver KPI', 'B20:AK34')));
app.get('/api/overtime',      (req,res)=> res.json(getSheetData('Overtime',   'B14:J26')));
app.get('/api/absentee',      (req,res)=> res.json({ message:'No data available yet' }));
app.get('/api/time-on-site',  (req,res)=> res.json({ message:'No data available yet' }));

/* === Start Server === */
app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
