import http.server
import socketserver

PORT = 8000
HOST = "localhost"

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Content-type', 'text/html')

        if self.path == '/' or self.path == '/index.instanssi.html':
            self.send_header('Content-Encoding', 'br')
        super().end_headers()

with socketserver.TCPServer((HOST, PORT), RequestHandler) as httpd:
    print(f"Open http://{HOST}:{PORT} and click to start the demo!")
    httpd.serve_forever()
