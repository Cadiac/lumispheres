from http.server import HTTPServer, BaseHTTPRequestHandler

class BrotliHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        file_path = 'entry/index.html.br'
        
        try:
            with open(file_path, 'rb') as file:
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.send_header('Content-Encoding', 'br')
                self.end_headers()
                self.wfile.write(file.read())
        except FileNotFoundError:
            self.send_error(404, 'File Not Found: %s' % self.path)

port = 8080
server_address = ('', port)
httpd = HTTPServer(server_address, BrotliHandler)

print(f'Open http://localhost:{port} and click to watch the entry!')
httpd.serve_forever()
