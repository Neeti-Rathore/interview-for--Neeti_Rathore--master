import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { format, sub, getYear, getMonth, setMonth, setYear } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const YEARS = Array.from({ length: 10 }, (_, i) => getYear(new Date()) - 8 + i); // 8 years back, 2 ahead
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PRESET_RANGES = [
  { label: "Past week", range: [sub(new Date(), { weeks: 1 }), new Date()] },
  { label: "Past month", range: [sub(new Date(), { months: 1 }), new Date()] },
  {
    label: "Past 3 months",
    range: [sub(new Date(), { months: 3 }), new Date()],
  },
  {
    label: "Past 6 months",
    range: [sub(new Date(), { months: 6 }), new Date()],
  },
  { label: "Past year", range: [sub(new Date(), { years: 1 }), new Date()] },
  { label: "Past 2 years", range: [sub(new Date(), { years: 2 }), new Date()] },
];

export default function DateRangePicker({ onDateChange }) {
  // State
  const [range, setRange] = useState({
    from: sub(new Date(), { months: 6 }),
    to: new Date(),
  });
  const [selectedPreset, setSelectedPreset] = useState("Past 6 months");
  const [displayMonth, setDisplayMonth] = useState(range.from || new Date());

  // Handlers
  const handlePresetChange = (label, from, to) => {
    setRange({ from, to });
    setSelectedPreset(label);
    onDateChange?.([from, to]);
    setDisplayMonth(from);
  };

  const handleSelect = (newRange) => {
    setRange(newRange);
    setSelectedPreset("");
    if (newRange.from && newRange.to) {
      onDateChange?.([newRange.from, newRange.to]);
      setDisplayMonth(newRange.from);
    }
  };

  const handleMonthYearChange = (monthIdx, type, value) => {
    let baseMonth = setMonth(displayMonth, getMonth(displayMonth));
    let newMonth = baseMonth;
    if (monthIdx === 1) {
      newMonth = setMonth(baseMonth, (getMonth(baseMonth) + 1) % 12);
      if (getMonth(baseMonth) === 11) {
        newMonth = setYear(newMonth, getYear(baseMonth) + 1);
      }
    }
    newMonth =
      type === "month" ? setMonth(newMonth, value) : setYear(newMonth, value);
    setDisplayMonth(newMonth);
  };

  const handleNav = (dir) => {
    setDisplayMonth((prev) => setMonth(prev, getMonth(prev) + dir));
  };

  // Helpers
  const formattedRange =
    range.from && range.to
      ? `${format(range.from, "MMM dd, yyyy")} - ${format(
          range.to,
          "MMM dd, yyyy"
        )}`
      : "Select Range";

  const renderMonthYearDropdowns = (monthIdx) => {
    let baseMonth = setMonth(displayMonth, getMonth(displayMonth));
    if (monthIdx === 1) {
      baseMonth = setMonth(baseMonth, (getMonth(baseMonth) + 1) % 12);
      if (getMonth(displayMonth) === 11) {
        baseMonth = setYear(baseMonth, getYear(displayMonth) + 1);
      }
    }
    return (
      <div className="text-[#4B5563] flex font-semibold items-center gap-4 md:gap-20 mb-2 border-b border-gray-200 pb-2">
        <select
          className="px-1 py-0.5 text-sm"
          value={getMonth(baseMonth)}
          onChange={(e) =>
            handleMonthYearChange(monthIdx, "month", Number(e.target.value))
          }
        >
          {MONTHS.map((m, idx) => (
            <option key={m} value={idx}>
              {m}
            </option>
          ))}
        </select>
        <select
          className="px-1 py-0.5 text-sm"
          value={getYear(baseMonth)}
          onChange={(e) =>
            handleMonthYearChange(monthIdx, "year", Number(e.target.value))
          }
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Render
  return (
    <Popover.Root>
      <Popover.Trigger className="flex justify-between items-center !bg-white text-[#4B5563] font-semibold !border-none !outline-none !focus-within:outline-none py-2 text-sm w-full md:w-auto">
        <img
          src="/src/assets/calenderIcon.svg"
          alt="calenderIcon"
          className="w-5 h-5 mr-2"
        />
        <span className="mr-2 truncate max-w-[160px] md:max-w-none">
          {selectedPreset || formattedRange}
        </span>
        <img
          src="/src/assets/dropDownIcon.svg"
          alt="dropdown"
          className="w-4 h-4"
        />
      </Popover.Trigger>

      <Popover.Content
        className="bg-white p-4 md:p-6 flex flex-col md:flex-row w-[95vw] max-w-2xl md:max-w-4xl shadow-lg rounded-lg border border-gray-200"
        sideOffset={8}
        style={{ zIndex: 1000 }}
      >
        {/* Presets */}
        <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-gray-200 flex flex-row md:flex-col justify-center mb-4 md:mb-0">
          {PRESET_RANGES.map(({ label, range: [from, to] }) => (
            <button
              key={label}
              onClick={() => handlePresetChange(label, from, to)}
              className={`w-full text-left font-bold text-[#4B5563] !bg-white text-base !outline-none !focus:outline-none !border-none py-2 px-2 md:px-0 ${
                selectedPreset === label ? "bg-gray-100" : ""
              }`}
              style={{ boxShadow: "none" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="flex flex-col gap-2 flex-1 pl-0 md:pl-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <button
              className="!bg-white text-[#4B5563] !focus-within:outline-none !border-none !outline-none p-2"
              onClick={() => handleNav(-1)}
              aria-label="Previous month"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" stroke="#4B5563" strokeWidth="2" />
              </svg>
            </button>
            <div className="flex gap-4 md:gap-8 !bg-white text-[#4B5563] w-full md:w-auto justify-center">
              {renderMonthYearDropdowns(0)}
              {renderMonthYearDropdowns(1)}
            </div>
            <button
              className="!bg-white !focus-within:outline-none !border-none !outline-none p-2"
              onClick={() => handleNav(1)}
              aria-label="Next month"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="#4B5563"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
            defaultMonth={displayMonth}
            pagedNavigation={false}
            showOutsideDays
            className="rdp-custom"
          />
        </div>
      </Popover.Content>
      <style>{`
        .rdp-custom .rdp-months {
          display: flex;
          flex-direction: row;
          gap: 1rem;
          color: #4b5563;
        }
        @media (max-width: 768px) {
          .rdp-custom .rdp-months {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
        .rdp-custom .rdp-month {
          background: #fff;
          border-radius: 1rem;
          box-shadow: none;
          padding: 0 0 1rem 0;
        }
        .rdp-custom .rdp-caption {
          display: none;
        }
        .rdp-custom .rdp-head_cell {
          color: #222;
          font-weight: 600;
          font-size: 1rem;
        }
        .rdp-custom .rdp-day {
          color: #222;
          font-size: 1rem;
          font-weight: 400;
          border-radius: 50%;
          transition: background 0.2s;
          outline: none !important;
          box-shadow: none !important;
        }
        .rdp-custom .rdp-day:focus, .rdp-custom .rdp-day:active {
          outline: none !important;
          box-shadow: none !important;
          background: inherit !important;
        }
        .rdp-custom .rdp-day_selected, .rdp-custom .rdp-day_range_start, .rdp-custom .rdp-day_range_end {
          background: #222 !important;
          color: #fff !important;
        }
        .rdp-custom .rdp-day_range_middle {
          background: #e5e7eb !important;
          color: #222 !important;
        }
        .rdp-custom .rdp-day:hover {
          background: #f3f4f6;
        }
        .rdp-custom .rdp-day_outside {
          color: #bbb;
        }
      `}</style>
    </Popover.Root>
  );
}
