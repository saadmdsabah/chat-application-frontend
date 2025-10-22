import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client: ReturnType<typeof Stomp.over> | null = null;

export function getStompClient() {
  if (!client) {
    const sock = new SockJS("http://localhost:8080/api/v1/chat");
    client = Stomp.over(() => sock);
  }
  return client;
}

export function connectClient(onConnect?: () => void) {
  const client = getStompClient();
  if (!client.connected) {
    client.connect({}, onConnect);
  }
  return client;
}
