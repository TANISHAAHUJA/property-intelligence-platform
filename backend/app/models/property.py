from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import uuid
from app.db.base import Base

class Property(Base):
    __tablename__ = "properties"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic property information
    address = Column(String(500), nullable=False, index=True)
    city = Column(String(100), nullable=False)
    state = Column(String(50), nullable=False)
    zip_code = Column(String(20), nullable=False)
    country = Column(String(50), default="USA")
    
    # Geographic data
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    geometry = Column(Geometry('POINT', srid=4326))
    
    # Property details
    property_type = Column(String(50))  # residential, commercial, industrial
    year_built = Column(Integer)
    square_footage = Column(Float)
    lot_size = Column(Float)
    bedrooms = Column(Integer)
    bathrooms = Column(Float)
    stories = Column(Integer)
    
    # Construction details
    construction_type = Column(String(100))
    roof_type = Column(String(100))
    foundation_type = Column(String(100))
    exterior_material = Column(String(100))
    
    # Market data
    current_value = Column(Float)
    market_value = Column(Float)
    assessed_value = Column(Float)
    tax_assessment = Column(Float)
    
    # Images and media
    satellite_image_url = Column(String(500))
    street_view_image_url = Column(String(500))
    property_images = Column(ARRAY(String), default=[])
    
    # Analysis flags
    is_analyzed = Column(Boolean, default=False)
    analysis_version = Column(String(20))
    last_analysis_date = Column(DateTime(timezone=True))
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Additional data
    additional_data = Column(JSON, default={})
    
    def __repr__(self):
        return f"<Property {self.address}>"