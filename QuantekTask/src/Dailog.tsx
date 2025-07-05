import * as Dialog from "@radix-ui/react-dialog";
import StatusChip from "./StatusChip";

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
  } = data;

  // Map status to lowercase for StatusChip
  let statusForChip = "na";
  if (status === "Success") statusForChip = "success";
  else if (status === "Failed") statusForChip = "failed";
  else if (status === "Upcoming") statusForChip = "upcoming";

  // Prepare details for the table
  const details = [
    { label: "Flight Number", value: data.flightNumber},
    { label: "Mission Name", value: missionName || "N/A" },
    { label: "Rocket Type", value: data.rocketType || "v1.0" },
    { label: "Rocket Name", value: rocketName || "Falcon 9" },
    { label: "Manufacturer", value: data.manufacturer || "SpaceX" },
    { label: "Nationality", value: data.nationality || "SpaceX" },
    { label: "Launch Date", value: formatDate(data.date) },
    { label: "Payload Type", value: data.payloadType || "Dragon 1.0" },
    { label: "Orbit", value: data.orbit || "ISS" },
    { label: "Launch Site", value: data.launchpad || "N/A" },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed z-50 bg-white rounded-xl shadow-lg p-4 sm:p-8 w-[90vw] max-w-full sm:max-w-xl md:max-w-[544px] min-h-[60vh] sm:min-h-[740.64px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
            <div className="flex items-center gap-4 w-full">
              <img
                src={imageUrl}
                alt={missionName}
                className="rounded-lg w-16 h-16 object-contain border flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg text-[#1F2937] sm:text-xl font-semibold mr-2 whitespace-normal break-words">
                    {missionName}
                  </h2>
                  <StatusChip status={statusForChip} />
                </div>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {(typeof rocketName === 'string' && rocketName.trim()) ? rocketName : 'Falcon 9'}
                </p>
              </div>
            </div>
            <Dialog.Close className="text-gray-500 !bg-white font-bold ml-0 sm:ml-4 mt-2 sm:mt-0 self-end ">
              <span className="text-xl items-end">X</span>
            </Dialog.Close>
          </div>

          <p className="mt-2 text-sm text-gray-700 mb-6 break-words">
            {description}
          </p>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-y-0 w-[480px]">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-row items-center py-0 border-b border-gray-100 last:border-b-0 h-[47px]"
                >
                  <span className="text-xs text-gray-500 font-medium w-1/2">
                    {item.label}
                  </span>
                  <span className="text-gray-800 font-medium text-sm break-words w-1/2">
                    {item.value || "N/A"}
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
