# Dockerfile para aplicação Flask
# Imagem base Python
FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR /app

# Variáveis de ambiente Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar arquivo de dependências
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Expor porta da aplicação
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["python", "app.py"]
