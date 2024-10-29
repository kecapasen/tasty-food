"use client";
import React from "react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Soup, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateOrderDTO, GetCartDetailDTO, GetCartDTO } from "@repo/dto";
import { patch, get, post } from "@/util/http-request";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toIDR } from "@/util";
import { socket } from "@/socket";

const Cart = () => {
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
    data: GetCartDTO;
  }>({
    queryKey: ["cart"],
    queryFn: async () => {
      return await get("/cart");
    },
  });
  const mutation = useMutation({
    mutationFn: async (values: CreateOrderDTO) => {
      return await post(`/order`, values);
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
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      socket.emit("getDataDashboard");
      socket.emit("getDataReport");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: error.message || "Terjadi kesalahan, silakan coba lagi.",
      });
    },
  });
  const mutateQuantity = useMutation({
    mutationFn: async (id: number) => {
      return await patch(`/cart/${id}`, { quantity: 0 });
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
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: error.message || "Terjadi kesalahan, silakan coba lagi.",
      });
    },
  });
  const columns: ColumnDef<GetCartDetailDTO>[] = [
    {
      accessorKey: "menu",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Menu
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
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
        <div className="capitalize line-clamp-1">{row.original.quantity}</div>
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
              <DropdownMenuSeparator />
              <Button
                variant="destructive"
                className="justify-start gap-2 h-auto w-full"
                onClick={() => {
                  mutateQuantity.mutate(row.original.id);
                }}
                disabled={mutateQuantity.isPending}
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
    data: data?.data.cartDetail ?? [],
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
    <Layout breadcrumb={[{ title: "Cart" }]} active={Pages.CART}>
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-end items-center gap-4">
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
              <a href={"/waiter/menu"}>
                <Soup className="h-5 w-5" />
                Tambah menu
              </a>
            </Button>
          </div>
        </div>
        <Button asChild size="sm" className="flex md:hidden items-center gap-2">
          <a href={"/waiter/menu"}>
            <Soup className="h-5 w-5" />
            Tambah menu
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
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() =>
            mutation.mutate({
              orderDetail: data!.data.cartDetail.map((item) => ({
                menuId: item.id,
                price: item.price,
                quantity: item.quantity,
                total: item.total,
              })),
              total: data!.data.cartDetail.reduce(
                (acc, curr) => Number(acc + curr.total),
                0
              ),
            })
          }
          disabled={mutation.isPending}
        >
          <FileText className="h-4 w-4" /> Buat pesanan
        </Button>
      </div>
    </Layout>
  );
};

export default Cart;
