# 教材「処理が返ってこない」の再現用。通知 API の代わりに接続を受け付けるが、応答は返さない。
import socket

server = socket.socket()
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(("", 9000))
server.listen(16)
held = []
while True:
    conn, _ = server.accept()
    held.append(conn)
