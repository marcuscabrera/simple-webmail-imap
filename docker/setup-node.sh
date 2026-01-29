#!/bin/bash

# Define a versão do Node.js desejada (LTS 20 é recomendada atualmente, mas o projeto pede 18+)
NODE_MAJOR=20

echo "Iniciando instalação do Node.js $NODE_MAJOR no Rocky Linux 9..."

# Atualiza o sistema
sudo dnf update -y

# Instala dependências básicas
sudo dnf install -y curl

# Adiciona o repositório oficial da NodeSource
# O script de setup da NodeSource detecta a distro e configura o repo correto
curl -fsSL https://rpm.nodesource.com/setup_$NODE_MAJOR.x | sudo bash -

# Instala o Node.js (que já inclui o npm)
sudo dnf install -y nodejs

# Opcional: Instala ferramentas de desenvolvimento (necessário para compilar addons nativos, ex: bcrypt)
sudo dnf groupinstall -y "Development Tools"

# Verifica as versões instaladas
echo "------------------------------------------------------------------------"
echo "Verificando instalação..."
echo "Node.js: $(node -v)"
echo "NPM: $(npm -v)"
echo "------------------------------------------------------------------------"
echo "Instalação concluída com sucesso!"
