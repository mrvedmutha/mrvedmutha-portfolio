"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/common/DataTable";
import getColumns from "@/helpers/admin/pages/contact.helpers";
import { IContactMessage } from "@/types/admin/pages/contact.types";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const PAGE_SIZE = 10;

const ContactTable = () => {
  const [data, setData] = useState<IContactMessage[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const fetchData = async () => {
    const res = await axios.get("/api/v1/home/contact");
    setData(res.data.data || []);
    setTotal((res.data.data || []).length);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/v1/home/contact/${id}`);
      toast({ title: "Deleted", description: "Contact message deleted." });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to delete.",
        variant: "destructive",
      });
    }
  };

  // Pass handleDelete to getColumns
  const columns = getColumns(handleDelete);

  return (
    <div className="w-full max-w-full px-8 py-4">
      <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
      <DataTable
        data={data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
        columns={columns}
        model="contact"
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
        divClassName="w-full"
      />
    </div>
  );
};

export default ContactTable;
