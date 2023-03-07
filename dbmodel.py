import uuid
from database import Base
from sqlalchemy import Column, String, Boolean, Float, Integer
from sqlalchemy.dialects.postgresql import UUID

class Item(Base):
    __tablename__ = 'people'
    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4)
    country = Column(String)
    year = Column(Integer)
    continent = Column(String)
    least_developed = Column(Boolean)
    life_expectancy = Column(Float)
    population = Column(Integer)
    co2_emissions = Column(Float)
    health_expenditure = Column(Float)
    electric_power_consumption = Column(Float)
    forest_area = Column(Float)
    gdp_per_capita = Column(Float)
    individuals_using_the_internet = Column(Float)
    military_expenditure = Column(Float)
    people_practicing_open_defecation = Column(Float)
    people_using_at_least_basic_drinking_water_services = Column(Float)
    obesity_among_adults = Column(Float)
    beer_consumption_per_capita = Column(Float)