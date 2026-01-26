from flask import Flask
import os
import socket
import datetime

app = Flask(__name__)

@app.route('/')
def home():
    hostname = socket.gethostname()
    app_name = os.getenv('APP_NAME', 'Kubernetes Flask App')
    environment = os.getenv('ENVIRONMENT', 'development')
    version = os.getenv('APP_VERSION', '1.0.0')
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return f"""
<!DOCTYPE html>
<html>
<head>
    <title>{app_name}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f5f5f5;
        }}
        .container {{
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        .header {{
            background: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .info-box {{
            background: #f9f9f9;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #4CAF50;
        }}
        .badge {{
            display: inline-block;
            padding: 5px 10px;
            background: #2196F3;
            color: white;
            border-radius: 3px;
            margin-right: 10px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 {app_name}</h1>
            <p>Exercise 4.10: Separate Code and Configuration</p>
        </div>
        
        <div class="info-box">
            <h3>📊 Application Details</h3>
            <p><strong>Environment:</strong> <span class="badge">{environment}</span></p>
            <p><strong>Version:</strong> <span class="badge">{version}</span></p>
            <p><strong>Hostname:</strong> {hostname}</p>
            <p><strong>Current Time:</strong> {current_time}</p>
        </div>
        
        <div class="info-box">
            <h3>📁 Repository Information</h3>
            <p>This is the <strong>Application Code Repository</strong></p>
            <p>Contains: Flask application code, Dockerfile, requirements.txt</p>
        </div>
        
        <div class="info-box">
            <h3>🎯 Exercise 4.10</h3>
            <p><strong>Goal:</strong> Separate code and configuration into different repositories</p>
            <p><strong>Status:</strong> ✅ Implemented</p>
            <p><strong>Configuration Repository:</strong> Contains Kubernetes manifests (deployment.yaml, service.yaml, configmap.yaml)</p>
        </div>
    </div>
</body>
</html>
"""

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
