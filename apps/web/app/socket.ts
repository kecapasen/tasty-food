"use client";
import { io, Socket } from "socket.io-client";

export const socket: Socket = io("http://152.42.252.147:8080", {
  withCredentials: true,
});
