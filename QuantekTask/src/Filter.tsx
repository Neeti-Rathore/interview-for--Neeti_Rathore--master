// components/FilterDropdown.tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface FilterDropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const FilterDropdown = ({
  options,
  selected,
  onSelect,
}: FilterDropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className=" relative flex items-center gap-2 border px-1 py-1 !bg-white rounded-md text-sm text-[#4B5563] font-medium hover:bg-gray-100">
          <img src={"/src/assets/filterIcon.svg"} alt="filter" className="w-4 h-4" />
          <span>{selected}</span>
          <img src={"/src/assets/dropDownIcon.svg"} alt="dropdown" className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        side="bottom"
        align="start"
        className="bg-white shadow-md rounded-md border mt-2 min-w-[170px] p-1 z-50"
      >
        {options.map((option) => (
          <DropdownMenu.Item
            key={option}
            onSelect={() => onSelect(option)}
            className={`px-4 py-2 text-[16px] text-[#4B5563] bg-white cursor-pointer rounded hover:bg-gray-100 ${
              selected === option ? "bg-gray-100 font-medium" : ""
            }`}
          >
            {option}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default FilterDropdown;
