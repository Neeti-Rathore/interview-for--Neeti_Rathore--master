import * as Dialog from "@radix-ui/react-dialog";
import StatusChip from "./StatusChip";

// Utility: fallback with default
const fallback = (value: any, def: string) => (typeof value === "string" && value.trim() ? value : def);

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface MissionData {
  missionName: string;
  rocketName: string;
  imageUrl: string;
  description: string;
  status: "Success" | "Failed" | "Upcoming";
  flightNumber?: string | number;
  date?: string;
  launchpad?: string;
  rocketType?: string;
  manufacturer?: string;
  nationality?: string;
  payloadType?: string;
  orbit?: string;
  links?: { wikipedia?: string };
  [key: string]: any;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: MissionData;
}

export default function MissionDialog({ open, onOpenChange, data }: Props) {
  const {
    missionName,
    rocketName,
    imageUrl,
    description,
    status,
    links = {},
    flightNumber,
    rocketType,
    manufacturer,
    nationality,
    date,
    payloadType,
    orbit,
    launchpad,
  } = data;

  // Status mapping
  const statusForChip = status?.toLowerCase?.() || "na";

  // Details config
  const details = [
    { label: "Flight Number", value: flightNumber },
    { label: "Mission Name", value: missionName },
    { label: "Rocket Type", value: fallback(rocketType, "v1.0") },
    { label: "Rocket Name", value: fallback(rocketName, "Falcon 9") },
    { label: "Manufacturer", value: fallback(manufacturer, "SpaceX") },
    { label: "Nationality", value: fallback(nationality, "SpaceX") },
    { label: "Launch Date", value: formatDate(date) },
    { label: "Payload Type", value: fallback(payloadType, "Dragon 1.0") },
    { label: "Orbit", value: fallback(orbit, "ISS") },
    { label: "Launch Site", value: fallback(launchpad, "N/A") },
  ];

  const wikipediaUrl = typeof links.wikipedia === "string" ? links.wikipedia : null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content
          onInteractOutside={e => e.preventDefault()}
          className="fixed z-50 bg-white rounded-xl shadow-lg p-4 sm:p-8 w-[95vw] max-w-full sm:max-w-xl md:max-w-[544px] min-h-[60vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4 w-full">
            <div className="flex items-center gap-4 w-full">
              <img
                src={imageUrl}
                alt={missionName}
                className="rounded-lg w-16 h-16 object-contain border flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1F2937] mr-2 break-words">
                    {missionName}
                  </h2>
                  <StatusChip status={statusForChip} />
                </div>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {fallback(rocketName, "Falcon 9")}
                </p>
              </div>
            </div>
            <Dialog.Close className="text-gray-500 !bg-white font-bold ml-0 sm:ml-4 mt-2 sm:mt-0 self-end !border-none !outline-none !focus:outline-none">
              <span className="text-xl">×</span>
            </Dialog.Close>
          </div>

          {/* Description */}
          <p className="mt-2 text-sm text-gray-700 mb-6 break-words">
            {description}
            {wikipediaUrl && (
              <>
                {' '}
                <a
                  href={wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 ml-1"
                >
                  Wikipedia
                </a>
              </>
            )}
          </p>

          {/* Details Table */}
          <div className="border-t border-gray-200 pt-4 w-full overflow-x-auto">
            <div className="flex flex-col gap-y-0 min-w-[320px] w-full">
              {details.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-row items-center py-0 border-b border-gray-100 last:border-b-0 h-[47px]"
                >
                  <span className="text-xs text-gray-500 font-medium w-1/2 truncate pr-2">
                    {label}
                  </span>
                  <span className="text-gray-800 font-medium text-sm break-words w-1/2">
                    {value ?? "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
