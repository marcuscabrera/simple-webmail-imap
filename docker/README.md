# 🐳 WebMailForcenecedor - Docker Setup

Configuração completa para executar o WebMailForcenecedor em Docker.

## 📁 Estrutura de Arquivos

```
docker/
├── docker-compose.yml      # Orquestração dos serviços
├── .env.example            # Template de variáveis de ambiente
├── Dockerfile              # Build da imagem Flask
├── flask-app/
│   ├── app.py              # Aplicação Flask principal
│   └── requirements.txt    # Dependências Python
├── init-scripts/
│   └── 01-init.sql         # Schema inicial PostgreSQL
├── nginx/
│   └── nginx.conf          # Configuração do proxy reverso
└── README.md               # Este arquivo
```

## 🚀 Início Rápido

### 1. Clonar e Configurar

```bash
# Entrar no diretório docker
cd docker

# Copiar arquivo de ambiente
cp .env.example .env

# Editar variáveis de ambiente
nano .env
```

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env`:

```env
# Flask
FLASK_ENV=production
SECRET_KEY=minha-chave-secreta-super-segura

# PostgreSQL
POSTGRES_USER=webmail
POSTGRES_PASSWORD=senha-forte-aqui
POSTGRES_DB=webmail_db

# Servidor de Email
IMAP_HOST=mail.seudominio.com
IMAP_PORT=143
SMTP_HOST=mail.seudominio.com
SMTP_PORT=25
```

### 3. Construir e Executar

```bash
# Construir imagens
docker-compose build

# Iniciar todos os serviços
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Verificar status
docker-compose ps
```

### 4. Acessar a Aplicação

- **Frontend**: http://localhost
- **API Flask**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📋 Comandos Úteis

### Gerenciamento

```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (⚠️ apaga dados)
docker-compose down -v

# Reiniciar um serviço específico
docker-compose restart web

# Ver logs de um serviço
docker-compose logs -f db
```

### Banco de Dados

```bash
# Acessar PostgreSQL
docker-compose exec db psql -U webmail -d webmail_db

# Backup do banco
docker-compose exec db pg_dump -U webmail webmail_db > backup.sql

# Restaurar backup
docker-compose exec -T db psql -U webmail webmail_db < backup.sql
```

### Debug

```bash
# Acessar container Flask
docker-compose exec web bash

# Verificar variáveis de ambiente
docker-compose exec web env

# Testar conexão IMAP
docker-compose exec web python -c "import imaplib; print(imaplib.IMAP4('mail.host.com', 143))"
```

## 🔧 Arquitetura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│   Flask     │────▶│ PostgreSQL  │
│   :80/:443  │     │   :5000     │     │   :5432     │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Redis    │
                    │   :6379     │
                    └─────────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
             ┌───────────┐ ┌───────────┐
             │   IMAP    │ │   SMTP    │
             │   :143    │ │   :25     │
             └───────────┘ └───────────┘
```

## 🔒 Segurança

### Requisitos de Produção

1. **HTTPS Obrigatório**
   - Descomente a seção HTTPS em `nginx.conf`
   - Configure certificados SSL em `nginx/ssl/`

2. **Senhas Fortes**
   - Altere todas as senhas padrão no `.env`
   - Use `openssl rand -base64 32` para gerar SECRET_KEY

3. **Firewall**
   ```bash
   # Permitir apenas portas necessárias
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw deny 5432/tcp  # PostgreSQL apenas interno
   ufw deny 6379/tcp  # Redis apenas interno
   ```

4. **Rate Limiting**
   - Já configurado no Nginx para `/api` e `/api/auth/login`

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários do webmail |
| `email_cache` | Cache local de emails |
| `attachments` | Metadados de anexos |
| `folders` | Pastas personalizadas |
| `contacts` | Contatos do usuário |
| `email_drafts` | Rascunhos de emails |
| `user_settings` | Configurações do usuário |

### Exemplo de Query

```sql
-- Buscar emails não lidos do usuário
SELECT subject, sender, received_at 
FROM email_cache 
WHERE user_id = 1 
  AND folder = 'INBOX' 
  AND is_read = FALSE 
ORDER BY received_at DESC 
LIMIT 50;
```

## 🐛 Troubleshooting

### Erro de Conexão IMAP

```bash
# Testar conectividade
docker-compose exec web python -c "
import socket
s = socket.socket()
s.settimeout(5)
try:
    s.connect(('mail.seudominio.com', 143))
    print('Conexão OK!')
except Exception as e:
    print(f'Erro: {e}')
"
```

### PostgreSQL não inicia

```bash
# Verificar logs
docker-compose logs db

# Limpar e recriar
docker-compose down -v
docker-compose up -d db
```

### Permissões de Volume

```bash
# Corrigir permissões
sudo chown -R 1000:1000 ./flask-app
sudo chmod -R 755 ./flask-app
```

## 📄 Licença

MIT License - Livre para uso comercial e modificação.
