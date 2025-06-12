import React, { useState } from "react";
import { Box, Button, Flex, Group, Select } from "@mantine/core";
import Comparison from "./Comparison";
import MonthlyComparison from "./MonthlyComparison";

const monthOptions = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const weekOptions = Array.from({ length: 4 }, (_, i) => `W${i + 1}`);

export default function Summary() {
  const [view, setView] = useState("summary"); // 'summary' | 'weekly' | 'monthly'
  const [month, setMonth] = useState(null);
  const [week, setWeek] = useState(null);

  return (
    <Box p="md">
      <Flex justify="space-between" align="center" mb="md">
        {/* Left: Show dropdowns for weekly or monthly comparison */}
        {(view === "weekly" || view === "monthly") ? (
          <Group wrap="nowrap">
            <Select
              label="Month"
              data={monthOptions}
              value={month}
              onChange={setMonth}
              w={130}
              placeholder="Select Month"
              withCheckIcon={null}
            />
            {view === "weekly" && (
              <Select
                label="Week"
                data={weekOptions}
                value={week}
                onChange={setWeek}
                w={130}
                placeholder="Select Week"
                withCheckIcon={null}
              />
            )}
          </Group>
        ) : (
          <div /> // spacing stub
        )}

        {/* Right: View toggle buttons */}
        <Button.Group>
          <Button
            radius="md"
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: view === "summary" ? "#1e293b" : "#f1f5f9",
              color: view === "summary" ? "white" : "#1e293b",
              border: '1px solid #1e293b',
            }}
            onClick={() => setView("summary")}
          >
            Summary
          </Button>
          <Button
            radius="md"
            style={{
              borderRadius: 0,
              backgroundColor: view === "weekly" ? "#1e293b" : "#f1f5f9",
              color: view === "weekly" ? "white" : "#1e293b",
              border: '1px solid #1e293b',
            }}
            onClick={() => setView("weekly")}
          >
            Weekly
          </Button>
          <Button
            radius="md"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              backgroundColor: view === "monthly" ? "#1e293b" : "#f1f5f9",
              color: view === "monthly" ? "white" : "#1e293b",
              border: '1px solid #1e293b',
            }}
            onClick={() => setView("monthly")}
          >
            Monthly
          </Button>
        </Button.Group>
      </Flex>

      {/* Content below toggle */}
      {/*view === "summary" && <SummaryCharts />*/}
      {view === "weekly" && <Comparison month={month} week={week} />}
      {view === "monthly" && <MonthlyComparison month={month} />}
    </Box>
  );
}
