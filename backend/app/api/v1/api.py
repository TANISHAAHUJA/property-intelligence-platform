from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    properties,
    analysis,
    hazards,
    valuation,
    upload,
    dashboard
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(hazards.router, prefix="/hazards", tags=["hazards"])
api_router.include_router(valuation.router, prefix="/valuation", tags=["valuation"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Property Intelligence Platform API",
        "version": "1.0.0"
    }