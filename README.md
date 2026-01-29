# 📧 WebMailForcenecedor

Um cliente webmail moderno e completo para servidores Postfix/Dovecot, construído com React, TypeScript e Flask.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-000000.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Monitoramento](#-monitoramento)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Contato](#-contato)

## 🎯 Visão Geral

O WebMailForcenecedor é uma solução completa de webmail projetada para integrar-se perfeitamente com servidores de email Postfix/Dovecot existentes. Oferece uma interface moderna e responsiva com suporte completo a IMAP/SMTP.

### Stack Tecnológica

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Python 3.11, Flask, SQLAlchemy, JWT |
| **Banco de Dados** | PostgreSQL 15 |
| **Cache** | Redis 7 |
| **Monitoramento** | Prometheus, Grafana, Alertmanager |
| **Infraestrutura** | Docker, Docker Compose, Nginx |

## ✨ Funcionalidades

### Interface do Usuário
- 📱 **Design Responsivo** - Interface adaptável para desktop, tablet e mobile
- 🌙 **Tema Escuro/Claro** - Alternância automática baseada nas preferências do sistema
- 📂 **Gerenciamento de Pastas** - Navegação intuitiva entre INBOX, Enviados, Rascunhos, Lixeira
- ✏️ **Editor de Email Rico** - Composição de emails com formatação avançada
- 🔍 **Busca Rápida** - Pesquisa instantânea em todas as mensagens

### Backend & Integração
- 🔐 **Autenticação IMAP** - Login direto no servidor de email
- 📤 **Envio via SMTP** - Suporte completo a envio de emails
- 💾 **Cache Inteligente** - Armazenamento local para acesso offline
- 🔄 **Sincronização em Tempo Real** - Atualização automática de novas mensagens

### Monitoramento & Observabilidade
- 📊 **Dashboards Grafana** - Visualização completa de métricas
- 🚨 **Alertas Automáticos** - Notificações para problemas críticos
- 📈 **Métricas IMAP/SMTP** - Monitoramento detalhado de operações de email
- 🐳 **Métricas de Containers** - Acompanhamento de recursos Docker

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│                    http://localhost:5173                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      NGINX (Proxy Reverso)                       │
│                    http://localhost:80                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      FLASK API (Backend)                         │
│                    http://localhost:5000                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  PostgreSQL │  │    Redis    │  │   IMAP/SMTP Servers     │  │
│  │    :5432    │  │    :6379    │  │   :143 / :25            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                     MONITORAMENTO                                │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│  Prometheus  │   Grafana    │ Alertmanager │     Exporters      │
│    :9090     │    :3000     │    :9093     │  :9100/:8080/:9187 │
└──────────────┴──────────────┴──────────────┴────────────────────┘
```

## 🚀 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ e npm
- [Docker](https://www.docker.com/) 24+ e Docker Compose
- Servidor de email Postfix/Dovecot configurado

### Instalação Rápida (Docker)

```bash
# 1. Clone o repositório
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Configure as variáveis de ambiente
cd docker
cp .env.example .env
nano .env  # Edite com suas configurações

# 3. Inicie todos os serviços
docker-compose up -d

# 4. Verifique o status
docker-compose ps
```

### Instalação para Desenvolvimento

```bash
# 1. Clone o repositório
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Instale as dependências do frontend
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Em outro terminal, inicie o backend
cd docker
docker-compose up -d db redis web
```

### URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:5173 | Interface do webmail |
| API | http://localhost:5000 | Backend Flask |
| Grafana | http://localhost:3000 | Dashboards de monitoramento |
| Prometheus | http://localhost:9090 | Métricas e queries |

## ⚙️ Configuração

### Variáveis de Ambiente

Edite o arquivo `docker/.env`:

```env
# Flask
FLASK_ENV=production
SECRET_KEY=sua-chave-secreta-muito-segura

# PostgreSQL
POSTGRES_USER=webmail
POSTGRES_PASSWORD=senha-forte-aqui
POSTGRES_DB=webmail_db

# Servidor de Email
IMAP_HOST=mail.seudominio.com
IMAP_PORT=143
SMTP_HOST=mail.seudominio.com
SMTP_PORT=25

# Monitoramento
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin123
```

### Configuração HTTPS (Produção)

Para habilitar HTTPS, adicione seus certificados SSL:

```bash
# Copie os certificados
cp seu-certificado.crt docker/nginx/ssl/cert.crt
cp sua-chave.key docker/nginx/ssl/cert.key

# Descomente a seção HTTPS em docker/nginx/nginx.conf
```

## 📊 Monitoramento

### Dashboards Disponíveis

1. **WebMail Overview** - Visão geral do sistema
   - Saúde dos containers
   - Uso de CPU e memória
   - Métricas de rede

2. **Email Metrics** - Métricas específicas de email
   - Conexões IMAP ativas
   - Taxa de envio SMTP
   - Latência de operações
   - Taxa de sucesso/falha de autenticação

### Alertas Configurados

| Alerta | Severidade | Descrição |
|--------|------------|-----------|
| HighCpuUsage | warning | CPU > 80% por 5 minutos |
| HighMemoryUsage | warning | Memória > 85% por 5 minutos |
| ContainerRestarting | critical | Container reiniciando frequentemente |
| ServiceDown | critical | Serviço indisponível por 1 minuto |

### Acessando Métricas

```bash
# Prometheus - Queries diretas
http://localhost:9090/graph

# Grafana - Login padrão: admin/admin123
http://localhost:3000

# Alertmanager - Status dos alertas
http://localhost:9093
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estas diretrizes:

### Como Contribuir

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/webmail.git`
3. **Crie uma branch**: `git checkout -b feature/minha-feature`
4. **Faça suas alterações** seguindo os padrões do projeto
5. **Commit**: `git commit -m 'feat: adiciona nova funcionalidade'`
6. **Push**: `git push origin feature/minha-feature`
7. **Abra um Pull Request**

### Padrões de Código

#### Frontend (TypeScript/React)
```typescript
// Use TypeScript strict mode
// Componentes funcionais com hooks
// Tailwind CSS para estilos
// shadcn/ui para componentes base

// Exemplo de componente
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children }) => {
  return (
    <button className={cn('btn', variant === 'primary' && 'btn-primary')}>
      {children}
    </button>
  );
};
```

#### Backend (Python/Flask)
```python
# Use type hints
# Docstrings para funções públicas
# Black para formatação
# Flake8 para linting

def get_emails(folder: str, limit: int = 50) -> list[dict]:
    """
    Busca emails de uma pasta específica.
    
    Args:
        folder: Nome da pasta IMAP
        limit: Número máximo de emails
        
    Returns:
        Lista de dicionários com dados dos emails
    """
    pass
```

### Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

### Reportando Bugs

Abra uma [Issue](../../issues/new) com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Versões (OS, Docker, Node.js)

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.

```
MIT License

Copyright (c) 2024 WebMailForcenecedor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contato

### Mantenedores

- **Email**: webmail-dev@seudominio.com
- **Issues**: [GitHub Issues](../../issues)
- **Discussões**: [GitHub Discussions](../../discussions)

### Links Úteis

- 📖 [Documentação Docker](./docker/README.md)
- 🐛 [Reportar Bug](../../issues/new?template=bug_report.md)
- 💡 [Sugerir Feature](../../issues/new?template=feature_request.md)
- 📊 [Changelog](./CHANGELOG.md)

---

<p align="center">
  Feito com ❤️ usando <a href="https://lovable.dev">Lovable</a>
</p>
