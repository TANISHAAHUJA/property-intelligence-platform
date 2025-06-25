from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from app.db.base import Base

class HazardAssessment(Base):
    __tablename__ = "hazard_assessments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("property_analyses.id"))
    
    # Hazard types and scores (0-100, higher = more risk)
    flood_risk_score = Column(Float, default=0.0)
    fire_risk_score = Column(Float, default=0.0)
    earthquake_risk_score = Column(Float, default=0.0)
    wind_risk_score = Column(Float, default=0.0)
    hail_risk_score = Column(Float, default=0.0)
    tornado_risk_score = Column(Float, default=0.0)
    hurricane_risk_score = Column(Float, default=0.0)
    
    # Environmental hazards
    wildfire_risk_score = Column(Float, default=0.0)
    landslide_risk_score = Column(Float, default=0.0)
    subsidence_risk_score = Column(Float, default=0.0)
    coastal_erosion_risk = Column(Float, default=0.0)
    
    # Man-made hazards
    crime_risk_score = Column(Float, default=0.0)
    industrial_hazard_score = Column(Float, default=0.0)
    traffic_risk_score = Column(Float, default=0.0)
    
    # Detailed risk factors
    flood_zone_designation = Column(String(20))  # A, AE, X, etc.
    distance_to_water_body = Column(Float)  # meters
    elevation_above_sea_level = Column(Float)  # meters
    slope_percentage = Column(Float)
    
    # Fire risk factors
    wildfire_interface_zone = Column(Boolean, default=False)
    defensible_space_rating = Column(Float)  # 0-100
    vegetation_type = Column(String(100))
    fire_station_distance = Column(Float)  # meters
    
    # Earthquake factors
    seismic_zone = Column(String(10))
    soil_type = Column(String(50))
    building_code_year = Column(Integer)
    
    # Weather patterns
    annual_precipitation = Column(Float)  # mm
    temperature_extremes = Column(JSON)  # min/max temps
    wind_patterns = Column(JSON)
    storm_frequency = Column(JSON)
    
    # Historical data
    historical_claims = Column(JSON, default=[])  # past insurance claims
    historical_disasters = Column(JSON, default=[])  # natural disasters in area
    
    # Risk mitigation features
    security_system = Column(Boolean, default=False)
    fire_suppression_system = Column(Boolean, default=False)
    storm_shutters = Column(Boolean, default=False)
    safe_room = Column(Boolean, default=False)
    backup_generator = Column(Boolean, default=False)
    
    # Overall assessment
    composite_risk_score = Column(Float)  # weighted combination of all risks
    risk_category = Column(String(20))  # low, moderate, high, extreme
    recommendations = Column(ARRAY(String), default=[])
    
    # Confidence and reliability
    data_quality_score = Column(Float)  # 0-1
    assessment_confidence = Column(Float)  # 0-1
    last_updated_sources = Column(JSON, default={})
    
    # Timestamps
    assessment_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    property = relationship("Property", backref="hazard_assessments")
    analysis = relationship("PropertyAnalysis", backref="hazard_assessment")
    
    def __repr__(self):
        return f"<HazardAssessment {self.property_id} - Risk: {self.composite_risk_score}>"