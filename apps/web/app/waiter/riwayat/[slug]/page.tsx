"use client";
import React, { useState } from "react";
import Layout, { Pages } from "@/components/layout";
import Spinner from "@/components/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GetOrderDetailDTO, GetOrderDTO } from "@repo/dto";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/util/http-request";
import { Badge } from "@/components/ui/badge";
import { Status } from "@repo/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toIDR } from "@/util";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

const DetailHistory = ({ params }: { params: { slug: string } }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { data, isPending } = useQuery<{
    data: GetOrderDTO;
  }>({
    queryKey: ["order"],
    queryFn: async () => {
      return await get(`/order/${parseInt(params.slug)}`);
    },
  });
  const columns: ColumnDef<GetOrderDetailDTO>[] = [
    {
      accessorKey: "menu",
      header: "Menu",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={row.original.menu.image || undefined}
              alt="Dekorator"
            />
            <AvatarFallback className="font-semibold">
              {row.original.menu.name
                .split(" ")
                .map((data: string) => data[0]?.toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
          <p className="capitalize line-clamp-1">{row.original.menu.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => (
        <Badge className="line-clamp-1">{row.original.menu.category}</Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Harga",
      cell: ({ row }) => (
        <div className="capitalize line-clamp-1">
          {toIDR(row.original.price)}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Kuantitas",
      cell: ({ row }) => (
        <div className="line-clamp-1">{`x${row.original.quantity}`}</div>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <div className="capitalize line-clamp-1">
          {toIDR(row.original.total)}
        </div>
      ),
    },
  ];
  const table = useReactTable({
    data: data?.data.orderDetail || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <Layout
      active={Pages.HISTORY}
      breadcrumb={[
        { title: "Riwayat", href: "/waiter/riwayat" },
        { title: "Detail riwayat" },
      ]}
    >
      {isPending && !data ? (
        <Spinner />
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <CardTitle>{`Order #${data!.data.id}`}</CardTitle>
                <Badge
                  variant={
                    data!.data.status === Status.COMPLETED
                      ? "default"
                      : data!.data.status === Status.PROGRESS
                        ? "secondary"
                        : data!.data.status === Status.PENDING
                          ? "outline"
                          : "destructive"
                  }
                  className="line-clamp-1"
                >
                  {data!.data.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={data!.data.user.avatar || undefined}
                      alt="Dekorator"
                    />
                    <AvatarFallback className="text-xs font-semibold">
                      {data!.data.user.fullname
                        .split(" ")
                        .map((data: string) => data[0]?.toUpperCase())
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardDescription className="capitalize line-clamp-1">
                    {data!.data.user.fullname}
                  </CardDescription>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <CardDescription>
                  {format(new Date(data!.data.createdAt), "PPPppp", {
                    locale: id,
                  })}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full flex flex-col gap-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {isPending ? (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            Mohon tunggu...
                          </TableCell>
                        </TableRow>
                      ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            Tidak ada data.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full"
              >
                <FileText className="h-4 w-4" />
                Print
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </Layout>
  );
};

export default DetailHistory;
