from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from app.db.base import Base

class PropertyAnalysis(Base):
    __tablename__ = "property_analyses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False)
    
    # Analysis metadata
    analysis_type = Column(String(50), nullable=False)  # full, quick, hazard_only, etc.
    status = Column(String(20), default="pending")  # pending, processing, completed, failed
    progress = Column(Float, default=0.0)  # 0.0 to 1.0
    
    # AI Model results
    computer_vision_results = Column(JSON, default={})
    satellite_analysis = Column(JSON, default={})
    street_view_analysis = Column(JSON, default={})
    
    # Risk assessments
    overall_risk_score = Column(Float)  # 0-100
    risk_factors = Column(JSON, default={})
    confidence_score = Column(Float)  # 0-1
    
    # Property condition
    structural_condition = Column(String(20))  # excellent, good, fair, poor
    roof_condition = Column(String(20))
    exterior_condition = Column(String(20))
    landscaping_condition = Column(String(20))
    
    # Detected features
    detected_features = Column(JSON, default={})  # pools, garages, sheds, etc.
    property_boundaries = Column(JSON, default={})  # polygon coordinates
    
    # Environmental factors
    vegetation_health = Column(Float)  # 0-1
    water_proximity = Column(Float)  # distance in meters
    flood_zone = Column(String(10))
    fire_risk_zone = Column(String(10))
    
    # Neighborhood analysis
    neighborhood_score = Column(Float)  # 0-100
    crime_score = Column(Float)  # 0-100
    walkability_score = Column(Float)  # 0-100
    school_rating = Column(Float)  # 0-10
    
    # Processing info
    processing_time = Column(Float)  # seconds
    model_version = Column(String(20))
    error_message = Column(Text)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    property = relationship("Property", backref="analyses")
    
    def __repr__(self):
        return f"<PropertyAnalysis {self.id} - {self.status}>"