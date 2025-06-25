from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData

# SQLAlchemy Base
Base = declarative_base()

# Import all models here to ensure they are registered with SQLAlchemy
from app.models.property import Property
from app.models.analysis import PropertyAnalysis
from app.models.hazard import HazardAssessment
from app.models.valuation import PropertyValuation
from app.models.user import User