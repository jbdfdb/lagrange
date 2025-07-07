from flask import Flask, render_template_string

app = Flask(__name__)

HTML = """
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Le Système Solaire et ses Points de Lagrange</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
    
    body { 
      margin: 0; 
      background: linear-gradient(135deg, #000011 0%, #000033 100%); 
      overflow: hidden; 
      font-family: 'Orbitron', monospace;
    }
    
    #title {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: #00FFFF;
      font-size: 24px;
      font-weight: 900;
      text-align: center;
      text-shadow: 0 0 20px #00FFFF;
      z-index: 1000;
      background: rgba(0,0,0,0.8);
      padding: 10px 20px;
      border-radius: 10px;
      border: 2px solid #00FFFF;
    }
    
    .panel {
      background: rgba(0,0,0,0.85);
      border: 1px solid #00FFFF;
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }
    
    button {
      font-family: 'Orbitron', monospace;
      background: linear-gradient(45deg, #001122, #003366);
      color: #00FFFF;
      border: 1px solid #00FFFF;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    button:hover {
      background: linear-gradient(45deg, #003366, #0066AA);
      box-shadow: 0 0 15px rgba(0,255,255,0.5);
      transform: translateY(-2px);
    }
    
    .active-referential {
      background: linear-gradient(45deg, #AA3300, #FF6600) !important;
      color: #FFFFFF !important;
      border-color: #FF6600 !important;
      box-shadow: 0 0 20px rgba(255,102,0,0.7);
    }
  </style>
</head>
<body>
<div id="title">🌌 LE SYSTÈME SOLAIRE<br><span style="font-size:14px;font-weight:400;">et ses Points de Lagrange</span></div>
<script type="module" src="/static/lagrange.js"></script>
</body>
</html>
"""

@app.route("/")
def index():
    return render_template_string(HTML)

if __name__ == "__main__":
    app.run(debug=True)