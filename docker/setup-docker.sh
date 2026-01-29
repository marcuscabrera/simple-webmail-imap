#!/bin/bash

# Remove pacotes antigos/conflitantes (Docker antigo, Podman, Buildah)
# Rocky Linux/RHEL frequentemente vem com Podman instalado, que pode conflitar com o Docker CE
sudo dnf remove -y docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine \
                  podman \
                  runc

# Atualiza o sistema
sudo dnf update -y

# Instala o pacote yum-utils (que fornece o dnf-plugins-core e config-manager)
sudo dnf install -y dnf-plugins-core

# Adiciona o repositório oficial do Docker (usando a versão CentOS que é compatível com Rocky/RHEL)
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Instala o Docker Engine, CLI, Containerd e plugins (Buildx, Compose)
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Pós-instalação: ativa serviço para iniciar no boot e inicia agora
sudo systemctl enable --now docker
sudo systemctl enable --now containerd

# Adiciona o usuário atual ao grupo docker para rodar sem sudo
sudo usermod -aG docker $USER

# Testa a instalação
# Nota: 'docker run' pode falhar se o grupo ainda não tiver sido atualizado na sessão atual
echo "Verificando versão do Docker..."
docker --version

echo "Docker Compose versão..."
docker compose version

echo "------------------------------------------------------------------------"
echo "Instalação concluída!"
echo "Para usar o Docker sem 'sudo', você precisa recarregar seu grupo de usuários."
echo "Execute: newgrp docker"
echo "Ou faça logout e login novamente."
echo "------------------------------------------------------------------------"
