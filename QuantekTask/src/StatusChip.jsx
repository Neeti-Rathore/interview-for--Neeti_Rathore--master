// Reusable status chip component for launch status
export default function StatusChip({ status }) {
  if (status === 'success') {
    return (
      <span className="bg-green-50 text-green-700 font-semibold text-xs rounded-full px-4 py-1 inline-block border border-green-100">
        Success
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="bg-red-50 text-red-700 font-semibold text-xs rounded-full px-4 py-1 inline-block border border-red-100">
        Failed
      </span>
    );
  }
  if (status === 'upcoming') {
    return (
      <span className="bg-yellow-100 text-yellow-800 font-semibold text-xs rounded-full px-4 py-1 inline-block border border-yellow-200">
        Upcoming
      </span>
    );
  }
  return (
    <span className="bg-gray-100 text-gray-500 font-semibold text-xs rounded-full px-4 py-1 inline-block border border-gray-200">
      N/A
    </span>
  );
}
