import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import FilterDropdown from "./Filter";
import { Table } from "./Table";
import StatusChip from "./StatusChip";
import MissionDialog from "./Dailog";
import DateRangePicker from "./Calender";


const LAUNCH_OPTIONS = [
  "All Launches",
  "Upcoming Launches",
  "Successful Launches",
  "Failed Launches",
];

const DEFAULT_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg";

const Dashboard = () => {
  const [filter, setFilter] = useState(LAUNCH_OPTIONS[0]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


  // Table columns definition
  const tableColumns = useMemo(() => [
    {
      header: "No.",
      accessor: "flight_number",
      render: (val) => <span className="text-xs text-[#1F2937]">{val}</span>,
    },
    {
      header: "Launched (UTC)",
      accessor: "date_utc",
      render: (val) =>
        val ? (
          <span className="text-xs text-[#1F2937]">{val}</span>
        ) : (
          <span className="text-gray-500">N/A</span>
        ),
    },
    {
      header: "Location",
      accessor: "launchpad",
      render: (val) => <span className="text-xs text-[#1F2937]">{val}</span>,
    },
    {
      header: "Mission",
      accessor: "name",
      render: (val) => (
        <span className="text-xs text-[#1F2937]">{val || "N/A"}</span>
      ),
    },
    {
      header: "Orbit",
      accessor: "payloads",
      render: () => (
        <span className="text-xs text-[#1F2937]">Low Earth Orbit</span>
      ),
    },
    {
      header: "Launch Status",
      accessor: "success",
      render: (val, row) => {
        let status = "na";
        if (val === true) status = "success";
        else if (val === false) status = "failed";
        else if (row?.upcoming) status = "upcoming";
        return <StatusChip status={status} />;
      },
    },
    {
      header: "Rocket",
      accessor: "rocket",
      render: () => <span className="text-xs text-[#1F2937]">Falcon 9</span>,
    },
  ], []);



  // Fetch launches
  const fetchLaunches = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("https://api.spacexdata.com/v5/launches");
      setTableData(data);
    } catch (error) {
      console.error("Failed to fetch SpaceX data:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);


  // Filtered data memoized
  const filteredData = useMemo(() => {
    switch (filter) {
      case "Upcoming Launches":
        return tableData.filter((item) => item.upcoming);
      case "Successful Launches":
        return tableData.filter((item) => item.success === true);
      case "Failed Launches":
        return tableData.filter((item) => item.success === false);
      default:
        return tableData;
    }
  }, [filter, tableData]);


  // Map SpaceX API row to MissionDialog data
  const mapRowToDialogData = (row) => ({
    missionName: row.name || "N/A",
    rocketName: row.rocket || "Falcon 9",
    imageUrl: row.links?.patch?.small || DEFAULT_IMAGE,
    description: row.details || "No description available.",
    status: row.upcoming
      ? "Upcoming"
      : row.success === true
      ? "Success"
      : row.success === false
      ? "Failed"
      : "N/A",
    flightNumber: row.flight_number,
    date: row.date_utc,
    launchpad: row.launchpad,
  });


  const handleRowClick = (row) => {
    setSelectedRow(mapRowToDialogData(row));
    setDialogOpen(true);
  };


  // Date range change handler (placeholder)
  const handleDateChange = () => {
    // Implement date filtering if needed
  };


  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex justify-center items-center mb-6 border-b border-gray-200 pb-2">
        <img src={"/src/assets/logo.svg"} alt="SpaceX Logo" className="h-8" />
      </div>

      {/* Filters */}
      <div className="flex flex-row justify-between items-center gap-4 mb-4 px-4 max-w-[952px] mx-auto">
        <DateRangePicker onDateChange={handleDateChange} />
        <FilterDropdown
          options={LAUNCH_OPTIONS}
          selected={filter}
          onSelect={setFilter}
        />
      </div>

      {/* Table */}
      <div className="max-w-[952px] mx-auto">
        <Table
          columns={tableColumns}
          currentData={filteredData}
          containerClassName="max-h-[676px]"
          tableClassName="bg-white rounded-xl"
          isLoading={loading}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Mission Dialog */}
      {selectedRow && (
        <MissionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          data={selectedRow}
        />
      )}
    </div>
  );
};

export default Dashboard;