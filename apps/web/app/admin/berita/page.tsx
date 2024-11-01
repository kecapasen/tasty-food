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
import { Feather, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetNewsDTO } from "@repo/dto";
import { del, get } from "@/util/http-request";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const News = () => {
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
    data: GetNewsDTO[];
  }>({
    queryKey: ["news"],
    queryFn: async () => {
      return await get("/news");
    },
  });
  const mutation = useMutation({
    mutationFn: async (id: number) => {
      return await del(`/news/${id}`);
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
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: error.message || "Terjadi kesalahan, silakan coba lagi.",
      });
    },
  });
  const columns: ColumnDef<GetNewsDTO>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Judul
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="capitalize font-semibold line-clamp-1">
            {row.getValue("title")}
          </p>
          <p className="text-xs line-clamp-1">
            {formatDistanceToNow(new Date(row.original.createdAt), {
              locale: id,
              addSuffix: true,
              includeSeconds: true,
            })}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: "Penulis",
      cell: ({ row }) => (
        <div className="capitalize line-clamp-1">
          {row.original.user.fullname}
        </div>
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
                  navigator.clipboard.writeText(row.original.id.toString())
                }
              >
                Salin ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Button
                variant="destructive"
                className="justify-start gap-2 h-auto w-full"
                onClick={() => {
                  mutation.mutate(row.original.id);
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
    <Layout breadcrumb={[{ title: "Berita" }]} active={Pages.NEWS}>
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          <Input
            placeholder="Cari berita..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
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
              <a href={"/admin/berita/tambah"}>
                <Feather className="h-4 w-4" />
                Buat berita
              </a>
            </Button>
          </div>
        </div>
        <Button asChild size="sm" className="flex md:hidden items-center gap-2">
          <a href={"/admin/berita/tambah"}>
            <Feather className="h-4 w-4" />
            Buat berita
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
                          className="block w-full h-full"
                          href={`/admin/berita/${row.original.id}`}
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

export default News;
