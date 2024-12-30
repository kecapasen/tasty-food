"use client";
import { io, Socket } from "socket.io-client";

export const socket: Socket = io("http://178.128.62.254:8080", {
  withCredentials: true,
});
