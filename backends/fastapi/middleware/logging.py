import logging
import sys
import structlog
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

class DomainException(Exception):
    """Base class for all application-specific exceptions."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

def setup_logging():
    """Configure structlog for JSON in prod and pretty-print in dev."""
    processors = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.TimeStamper(fmt="iso"),
    ]

    if sys.stdout.isatty():
        # Pretty-print for interactive terminals (dev)
        processors.append(structlog.dev.ConsoleRenderer())
    else:
        # JSON for production logs
        processors.append(structlog.processors.JSONRenderer())

    structlog.configure(
        processors=processors,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )

async def domain_exception_handler(request: Request, exc: DomainException):
    """Global handler for application errors."""
    logger = structlog.get_logger()
    logger.error("application_error", message=exc.message, status_code=exc.status_code)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )

async def universal_exception_handler(request: Request, exc: Exception):
    """Catch-all for unexpected system errors."""
    logger = structlog.get_logger()
    logger.exception("unhandled_system_error", error=str(exc))
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected server error occurred."},
    )
