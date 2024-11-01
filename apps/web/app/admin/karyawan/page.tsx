"use client";
import React, { useEffect, useState } from "react";
import Layout, { Pages } from "@/components/layout";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, UserRoundPlus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetUserDTO } from "@repo/dto";
import { del, get } from "@/util/http-request";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Employee = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery<{
    data: GetUserDTO[];
  }>({
    queryKey: ["user"],
    queryFn: async () => {
      return await get("/user");
    },
  });
  const mutation = useMutation({
    mutationFn: async (id: number) => {
      return await del(`/user/${id}`);
    },
    onMutate: () => {
      toast({
        title: "Mohon tunggu...",
        description: "Mohon tunggu, proses sedang berlangsung.",
      });
    },
    onSuccess: (data: { statusCode: number; message: string }) => {
      toast({
        title: "Sukses!",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: error.message || "Terjadi kesalahan, silakan coba lagi.",
      });
    },
  });
  const columns: ColumnDef<GetUserDTO>[] = [
    {
      accessorKey: "userId",
      header: "ID",
      cell: ({ row }) => (
        <div className="capitalize line-clamp-1">{row.original.userId}</div>
      ),
    },
    {
      accessorKey: "fullname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={row.original.avatar || undefined}
              alt="Dekorator"
            />
            <AvatarFallback className="font-semibold">
              {row.original.fullname
                .split(" ")
                .map((data: string) => data[0]?.toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
          <p className="capitalize line-clamp-1">{row.original.fullname}</p>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.role === "ADMIN"
              ? "default"
              : row.original.role === "CHEF"
                ? "secondary"
                : row.original.role === "WAITER"
                  ? "outline"
                  : "destructive"
          }
          className="line-clamp-1"
        >
          {row.original.role}
        </Badge>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.userId.toString())
                }
              >
                Salin ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Button
                variant="destructive"
                className="justify-start gap-2 h-auto w-full"
                onClick={() => {
                  mutation.mutate(row.original.userId);
                }}
                disabled={mutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const table = useReactTable({
    data: data?.data || [],
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
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <Layout breadcrumb={[{ title: "Karyawan" }]} active={Pages.EMPLOYEE}>
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          <Input
            placeholder="Cari karyawan..."
            value={
              (table.getColumn("fullname")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("fullname")?.setFilterValue(event.target.value)
            }
            className="max-w-sm font-normal"
          />
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Kolom <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              asChild
              className="h-auto hidden md:inline-flex items-center gap-2"
              size="sm"
            >
              <a href={"/admin/karyawan/tambah"}>
                <UserRoundPlus className="h-4 w-4" />
                Tambah karyawan
              </a>
            </Button>
          </div>
        </div>
        <Button asChild size="sm" className="flex md:hidden items-center gap-2">
          <a href={"/admin/karyawan/tambah"}>
            <UserRoundPlus className="h-4 w-4" />
            Tambah karyawan
          </a>
        </Button>
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
                        <a
                          href={`/admin/karyawan/${row.original.userId}`}
                          className="block w-full h-full"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </a>
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
        <div className="flex items-center justify-end space-x-2">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Employee;
