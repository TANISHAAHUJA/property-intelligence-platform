from pydantic_settings import BaseSettings
from typing import Optional, List
import os
from pathlib import Path

class Settings(BaseSettings):
    # Basic app settings
    PROJECT_NAME: str = "Property Intelligence Platform"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "AI-powered property assessment platform for insurance companies"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    JWT_SECRET_KEY: str = "your-jwt-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/property_intelligence"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # External APIs
    GOOGLE_MAPS_API_KEY: Optional[str] = None
    MAPBOX_ACCESS_TOKEN: Optional[str] = None
    OPENWEATHER_API_KEY: Optional[str] = None
    ZILLOW_API_KEY: Optional[str] = None
    CRIME_DATA_API_KEY: Optional[str] = None
    SATELLITE_IMAGERY_API_KEY: Optional[str] = None
    
    # URLs
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:8000"
    
    # ML Model Settings
    MODEL_VERSION: str = "v1.0"
    BATCH_SIZE: int = 32
    MAX_CONCURRENT_ANALYSES: int = 100
    
    # AWS/Cloud Storage
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_BUCKET_NAME: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    NEW_RELIC_LICENSE_KEY: Optional[str] = None
    
    # CORS
    ALLOWED_HOSTS: List[str] = [
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
    ]
    
    # File paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    MODEL_DIR: Path = BASE_DIR / "models"
    LOG_DIR: Path = BASE_DIR / "logs"
    
    # Analysis settings
    MAX_PROPERTY_ANALYSIS_TIME: int = 300  # 5 minutes
    SATELLITE_IMAGE_RESOLUTION: int = 1024
    RISK_FACTORS: List[str] = [
        "flood",
        "fire",
        "earthquake",
        "crime",
        "structural",
        "environmental"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Create directories if they don't exist
        self.UPLOAD_DIR.mkdir(exist_ok=True)
        self.MODEL_DIR.mkdir(exist_ok=True)
        self.LOG_DIR.mkdir(exist_ok=True)

settings = Settings()