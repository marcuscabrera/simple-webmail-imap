"""
WebMailForcenecedor - Backend Flask
Webmail Client para Postfix/Dovecot
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
import imaplib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Inicialização
app = Flask(__name__)
CORS(app)

# ===========================================
# CONFIGURAÇÕES
# ===========================================
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://webmail:webmail123@localhost:5432/webmail_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET_KEY', 'jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# IMAP/SMTP
IMAP_HOST = os.environ.get('IMAP_HOST', 'mail.seudominio.com')
IMAP_PORT = int(os.environ.get('IMAP_PORT', 143))
SMTP_HOST = os.environ.get('SMTP_HOST', 'mail.seudominio.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 25))

# Extensões
db = SQLAlchemy(app)
jwt = JWTManager(app)

# ===========================================
# MODELOS
# ===========================================
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    last_login = db.Column(db.DateTime)

class EmailCache(db.Model):
    __tablename__ = 'email_cache'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message_id = db.Column(db.String(255), nullable=False)
    folder = db.Column(db.String(100), default='INBOX')
    subject = db.Column(db.Text)
    sender = db.Column(db.String(255))
    recipient = db.Column(db.String(255))
    body_preview = db.Column(db.Text)
    received_at = db.Column(db.DateTime)
    is_read = db.Column(db.Boolean, default=False)
    is_starred = db.Column(db.Boolean, default=False)

# ===========================================
# SERVIÇO IMAP
# ===========================================
class IMAPService:
    @staticmethod
    def connect(username: str, password: str):
        """Conectar ao servidor IMAP"""
        try:
            mail = imaplib.IMAP4(IMAP_HOST, IMAP_PORT)
            mail.login(username, password)
            return mail, None
        except imaplib.IMAP4.error as e:
            return None, str(e)
    
    @staticmethod
    def get_folders(mail):
        """Listar pastas do usuário"""
        status, folders = mail.list()
        if status == 'OK':
            return [f.decode().split('"')[-2] for f in folders]
        return []
    
    @staticmethod
    def get_emails(mail, folder='INBOX', limit=50):
        """Buscar emails de uma pasta"""
        mail.select(folder)
        status, messages = mail.search(None, 'ALL')
        if status != 'OK':
            return []
        
        email_ids = messages[0].split()[-limit:]
        emails = []
        
        for email_id in reversed(email_ids):
            status, msg_data = mail.fetch(email_id, '(RFC822.HEADER)')
            if status == 'OK':
                # Parse email headers
                emails.append({
                    'id': email_id.decode(),
                    'raw': msg_data[0][1]
                })
        
        return emails

# ===========================================
# SERVIÇO SMTP
# ===========================================
class SMTPService:
    @staticmethod
    def send_email(username: str, password: str, to: str, subject: str, body: str):
        """Enviar email via SMTP"""
        try:
            msg = MIMEMultipart()
            msg['From'] = username
            msg['To'] = to
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.login(username, password)
                server.send_message(msg)
            
            return True, None
        except Exception as e:
            return False, str(e)

# ===========================================
# ROTAS DA API
# ===========================================
@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'WebMailForcenecedor'})

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Autenticar via IMAP"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    mail, error = IMAPService.connect(username, password)
    if mail:
        mail.logout()
        # Criar/atualizar usuário no banco
        user = User.query.filter_by(email=username).first()
        if not user:
            user = User(email=username, username=username.split('@')[0])
            db.session.add(user)
        user.last_login = db.func.now()
        db.session.commit()
        
        from flask_jwt_extended import create_access_token
        token = create_access_token(identity=username)
        return jsonify({'success': True, 'token': token})
    
    return jsonify({'success': False, 'error': error}), 401

@app.route('/api/folders')
def get_folders():
    """Listar pastas do usuário"""
    # Requer autenticação JWT e credenciais IMAP
    return jsonify({'folders': ['INBOX', 'Sent', 'Drafts', 'Trash', 'Spam']})

@app.route('/api/emails/<folder>')
def get_emails(folder):
    """Buscar emails de uma pasta"""
    # Implementar busca real via IMAP
    return jsonify({'emails': [], 'folder': folder})

@app.route('/api/emails/send', methods=['POST'])
def send_email():
    """Enviar email via SMTP"""
    data = request.get_json()
    # Implementar envio real via SMTP
    return jsonify({'success': True})

# ===========================================
# INICIALIZAÇÃO
# ===========================================
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(host='0.0.0.0', port=5000, debug=os.environ.get('FLASK_ENV') == 'development')
