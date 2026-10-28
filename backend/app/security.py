"""Bounded, per-process authentication throttling and response protections."""
from collections import OrderedDict
from threading import Lock
from time import monotonic
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


class SecurityMiddleware(BaseHTTPMiddleware):
    # Deploy a shared limiter at the edge before scaling to multiple instances.
    limits = {
        "/api/auth/login": (20, 300),
        "/api/auth/register": (10, 3600),
        "/api/auth/forgot-password": (5, 900),
        "/api/auth/reset-password": (10, 900),
        "/api/auth/google": (20, 300),
    }

    def __init__(self, app):
        super().__init__(app)
        self.windows = OrderedDict()
        self.lock = Lock()

    async def dispatch(self, request, call_next):
        limit = self.limits.get(request.url.path.rstrip("/"))
        response = None
        if request.method == "POST" and limit:
            maximum, duration = limit
            key = (request.client.host if request.client else "unknown", request.url.path)
            now = monotonic()
            with self.lock:
                started, count = self.windows.get(key, (now, 0))
                if now - started >= duration:
                    started, count = now, 0
                self.windows[key] = (started, count + 1)
                self.windows.move_to_end(key)
                if len(self.windows) > 10000:
                    self.windows.popitem(last=False)
                if count >= maximum:
                    response = JSONResponse(
                        {"detail": "Too many attempts. Please try again later."},
                        status_code=429,
                        headers={"Retry-After": str(max(1, int(duration - (now - started))))},
                    )
        if response is None:
            response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "no-referrer"
        if request.url.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store"
        return response
