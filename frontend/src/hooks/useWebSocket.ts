import { useEffect, useState, useRef } from 'react';

type WebSocketEvent = {
  type: "NEW_TRANSACTION" | "NEW_ALERT" | "CASE_UPDATED" | "KPI_UPDATED";
  data: any;
};

export function useWebSocket(url: string) {
  const [lastMessage, setLastMessage] = useState<WebSocketEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WS
    const socket = new WebSocket(url);
    ws.current = socket;

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (e) {
        console.error("Invalid WS message", e);
      }
    };

    return () => {
      socket.close();
    };
  }, [url]);

  return { lastMessage, isConnected };
}
