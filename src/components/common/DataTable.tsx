"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  model: string;
  divClassName?: string;
  captionLink?: string;
  captionText?: string;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

const DataTable = <T,>({
  data,
  columns,
  model,
  divClassName = "",
  captionLink = "",
  captionText = "",
  page,
  pageSize,
  total,
  onPageChange,
}: DataTableProps<T>) => {
  const totalPages = Math.ceil(total / pageSize);
  const [loading, setLoading] = useState(false);
  console.log(data);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={divClassName}>
      <Table className="mt-5">
        {captionText && (
          <TableCaption className="text-left">
            {captionLink ? (
              <Link href={captionLink}>{captionText}</Link>
            ) : (
              captionText
            )}
          </TableCaption>
        )}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {columns.map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-4">
        <span className="text-sm font-medium">
          Page {page} of {isNaN(totalPages) ? 1 : totalPages}
        </span>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || data.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
