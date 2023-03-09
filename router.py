from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from fastapi import Depends, APIRouter, HTTPException, status
from database import get_db
from dbmodel import Item
import model
from typing import Optional
import uuid


router = APIRouter()

@router.get("/")
async def get_people(db: Session = Depends(get_db), country: Optional[str] = None):
    people = []
    if country is not None:
        people = db.query(Item).filter(Item.country.contains(country)).all()
    else:
        people = db.query(Item).all()
    return {'status': 'success', 'results': len(people), 'items': people}

@router.post("/")
async def create_item(item: model.Item, db: Session = Depends(get_db)):
    new_item = Item(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/")
async def update_item(item: model.ItemResponse, db: Session = Depends(get_db)):
    item_query = db.query(Item).filter(Item.id == item.id)
    updated_item = item_query.first()

    if not updated_item:
        raise HTTPException(status_code=status.HTTP_200_OK, detail=f'No item with this id: {item.id} found')
    
    item_query.update(item.dict(exclude_unset=True), synchronize_session=False)
    db.commit()
    return updated_item

@router.get("/lifeExpImprovedByDrinking/")
async def get_people2(db: Session = Depends(get_db)):
    query = '''select p1.country, p2.country,  
    p1.life_expectancy as life_expectancy_ealriest, p2.life_expectancy as life_expectancy_newest,
    (SELECT avg(life_expectancy) from people where country = p1.country group by country) as avg_life_expectancy,
    p1.beer_consumption_per_capita as beer_consumption_per_capita_earliest,p2.beer_consumption_per_capita as beer_consumption_per_capita_newest,
    (SELECT avg(beer_consumption_per_capita) from people where country = p1.country group by country) as avg_beer_consumption_per_capita
    from people p1, people p2
    where 
    p1.year = (SELECT min(year) from people where country = p1.country group by country) and
    p2.year = (SELECT max(year) from people where country = p1.country group by country)  and
    p1.country = p2.country and
    p1.life_expectancy < p2.life_expectancy and
    p1.beer_consumption_per_capita < p2.beer_consumption_per_capita and
    p2.beer_consumption_per_capita > (SELECT avg(beer_consumption_per_capita) from people where country = p1.country group by country) and
    p2.life_expectancy > (SELECT avg(life_expectancy) from people where country = p1.country group by country)
    '''
    result = []
    people = db.execute(text(query))
    for p in people:
        result.append(p)
    
    return {'status': 'success', 'results': len(result), 'items': result}