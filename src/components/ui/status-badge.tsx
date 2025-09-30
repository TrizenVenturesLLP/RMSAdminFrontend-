import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "success" | "warning" | "danger" | "info" | "pending";
  children: React.ReactNode;
  className?: string;
}

const statusStyles = {
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-gray-100 text-gray-800 border-gray-200",
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}