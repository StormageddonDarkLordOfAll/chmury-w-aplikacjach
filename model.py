from pydantic import BaseModel
from typing import Optional, List
import uuid

class Item(BaseModel):
    country: Optional[str] = None
    year: Optional[int] = None
    continent: Optional[str] = None
    least_developed: Optional[bool] = None
    life_expectancy: Optional[float]=None
    population: Optional[int] = None
    co2_emissions: Optional[float] = None
    health_expenditure: Optional[float] = None
    electric_power_consumption: Optional[float] = None
    forest_area: Optional[float] = None
    gdp_per_capita: Optional[float] = None
    individuals_using_the_internet: Optional[float] = None
    military_expenditure: Optional[float] = None
    people_practicing_open_defecation: Optional[float] = None
    people_using_at_least_basic_drinking_water_services: Optional[float] = None
    obesity_among_adults: Optional[float] = None
    beer_consumption_per_capita: Optional[float] = None

class ItemResponse(Item):
    id: uuid.UUID

class ListItemResponse(BaseModel):
    status: str
    results: int
    items: List[ItemResponse]
