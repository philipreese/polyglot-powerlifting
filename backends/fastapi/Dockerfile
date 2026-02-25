# Use the official Python image
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Install uv (the fast Python package installer and resolver)
RUN pip install uv

# Copy the dependency files
# We only copy these first to leverage Docker's layer caching mechanism.
# If these files haven't changed, Docker won't re-download the packages.
COPY pyproject.toml uv.lock ./

# Install the application dependencies globally in the container
RUN uv sync --locked

# Copy the actual application code into the container
COPY . .

# Expose the port Uvicorn will run on
EXPOSE 8000

# The command to start the FastAPI server
# Since uv sync installed everything (including uvicorn) into the project's .venv, 
# we need to make sure we run it via uv or explicitly point to the venv binary.
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
