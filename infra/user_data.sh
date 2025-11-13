#!/bin/bash
set -eux

# Update and install essentials
apt-get update -y
apt-get install -y curl git

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# PM2
npm install -g pm2

# Create app directory (CI will deploy here)
mkdir -p /opt/newsfusion/backend
chown -R ubuntu:ubuntu /opt/newsfusion

# Enable PM2 startup
pm2 startup systemd -u ubuntu --hp /home/ubuntu
