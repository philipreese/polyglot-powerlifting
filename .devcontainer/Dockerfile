FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install baseline packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Note: Node.js (with pnpm) and Python are installed via devcontainer features.

# (Optional) Future-proofing: We could install Flutter here, 
# but per the learning plan it can be installed just-in-time in Phase 5.
