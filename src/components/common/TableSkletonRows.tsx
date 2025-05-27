import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeletonRows({ columnsCount = 4, rowsCount = 3 }) {
  return (
    <>
      {Array.from({ length: rowsCount }).map((_, i) => (
        <TableRow key={`skeleton-${i}`}>
          {Array.from({ length: columnsCount }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
