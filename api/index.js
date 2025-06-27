import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import dotenv from 'dotenv';
import { format, startOfWeek, endOfWeek } from 'date-fns';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

/* === /api/comparison === */
app.get('/api/comparison', async (req, res) => {
  try {
    await sql.connect(config);
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
        day: format(d, 'EEE'),
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('❌ /api/comparison failed:', err);
    res.status(500).json({ error: 'Comparison query failed' });
  }
});

/* === /api/summary === */
app.get('/api/summary', async (req, res) => {
  try {
    await sql.connect(config);

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
        month: d.toLocaleString('en-AU', { month: 'short' }),
        week,
        day: d.toLocaleDateString('en-AU', { weekday: 'short' }),
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('❌ /api/summary failed:', err);
    res.status(500).json({ error: 'Summary query failed' });
  }
});

/* === Start local server (optional for dev) === */
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Dev API running at http://localhost:${PORT}`);
  });
}

export default app;
