"use client";
import { io, Socket } from "socket.io-client";

export const socket: Socket = io("http://localhost:8080", {
  withCredentials: true,
});
