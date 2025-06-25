from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from passlib.context import CryptContext
import uuid
from app.db.base import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic info
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True)
    full_name = Column(String(200))
    
    # Authentication
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Role and permissions
    role = Column(String(50), default="user")  # user, admin, analyst, underwriter
    permissions = Column(JSON, default=[])
    
    # Company info
    company_name = Column(String(200))
    company_role = Column(String(100))
    department = Column(String(100))
    
    # Preferences
    preferences = Column(JSON, default={})
    
    # Usage tracking
    last_login = Column(DateTime(timezone=True))
    login_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def verify_password(self, password: str) -> bool:
        """Verify password against hash"""
        return pwd_context.verify(password, self.hashed_password)
    
    def set_password(self, password: str):
        """Set password hash"""
        self.hashed_password = pwd_context.hash(password)
    
    def __repr__(self):
        return f"<User {self.email}>"