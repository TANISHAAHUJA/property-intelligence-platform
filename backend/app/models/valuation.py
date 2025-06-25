from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from app.db.base import Base

class PropertyValuation(Base):
    __tablename__ = "property_valuations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("property_analyses.id"))
    
    # Valuation results
    estimated_value = Column(Float, nullable=False)
    confidence_interval_low = Column(Float)
    confidence_interval_high = Column(Float)
    confidence_score = Column(Float)  # 0-1
    
    # Market comparison
    comparable_properties = Column(JSON, default=[])  # list of similar properties
    market_trend = Column(String(20))  # increasing, stable, declining
    days_on_market_estimate = Column(Integer)
    
    # Valuation components
    land_value = Column(Float)
    improvement_value = Column(Float)
    depreciation_amount = Column(Float)
    
    # Adjustment factors
    location_adjustment = Column(Float)  # percentage
    condition_adjustment = Column(Float)  # percentage
    market_adjustment = Column(Float)  # percentage
    risk_adjustment = Column(Float)  # percentage based on hazards
    
    # Detailed breakdowns
    sq_ft_value = Column(Float)  # value per square foot
    lot_value_per_sq_ft = Column(Float)
    
    # Features impact on value
    feature_adjustments = Column(JSON, default={})  # pools, garages, etc.
    renovation_impact = Column(Float)  # estimated renovation costs
    
    # Insurance-specific valuations
    replacement_cost = Column(Float)  # cost to rebuild
    actual_cash_value = Column(Float)  # replacement cost - depreciation
    dwelling_coverage_amount = Column(Float)  # recommended insurance coverage
    
    # Market data sources
    mls_data = Column(JSON, default={})
    public_records = Column(JSON, default={})
    tax_assessment_data = Column(JSON, default={})
    
    # Valuation methodology
    primary_method = Column(String(50))  # comparative_market, cost, income
    methods_used = Column(ARRAY(String), default=[])
    model_version = Column(String(20))
    
    # Quality metrics
    data_completeness = Column(Float)  # 0-1
    comparable_quality = Column(Float)  # 0-1
    market_activity_level = Column(String(20))  # high, medium, low
    
    # Temporal factors
    valuation_date = Column(DateTime(timezone=True), server_default=func.now())
    effective_date = Column(DateTime(timezone=True))  # date valuation is effective for
    expiration_date = Column(DateTime(timezone=True))  # when valuation becomes stale
    
    # External validations
    appraisal_comparison = Column(Float)  # difference from professional appraisal
    zillow_zestimate = Column(Float)
    redfin_estimate = Column(Float)
    
    # Seasonal adjustments
    seasonal_factor = Column(Float)  # market seasonality adjustment
    
    # Notes and recommendations
    valuation_notes = Column(Text)
    recommendations = Column(ARRAY(String), default=[])
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    property = relationship("Property", backref="valuations")
    analysis = relationship("PropertyAnalysis", backref="valuation")
    
    def __repr__(self):
        return f"<PropertyValuation {self.property_id} - ${self.estimated_value:,.0f}>"