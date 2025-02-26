# Use the official Puppeteer image
FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root for package installation
USER root

# Set the working directory
WORKDIR /app

# Install Xvfb and other necessary packages
RUN apt-get update && apt-get install -y \
xvfb \
    xorg \
    gtk2-engines-pixbuf \
    xfonts-base \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-scalable \
    imagemagick \
    x11-apps \
    dbus-x11 \
    libx11-dev \
    libgdk-pixbuf2.0-0 \
    libnss3 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libgdk-pixbuf2.0-0 \
    libxss1 \
    fonts-liberation \
    xdg-utils \
    wget \
    curl \
    ca-certificates \
    libvulkan1 \
    vulkan-tools \
    mesa-vulkan-drivers \
    && rm -rf /var/lib/apt/lists/*

# Set display environment variable
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PORT=8080 \
    ANGLE_DEFAULT_PLATFORM=vulkan \
    DISPLAY=:99 \
    LIBGL_ALWAYS_SOFTWARE=0 \
    LIBGL_ALWAYS_INDIRECT=0


# Copy our application files
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Build the application
RUN npm run build

# Make start script executable
RUN chmod +x start.sh

# Expose the port Cloud Run will use
EXPOSE 8080

# Use our start script
CMD ["./start.sh"]