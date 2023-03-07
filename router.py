from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter
from database import get_db
from dbmodel import Item


router = APIRouter()

@router.get("/")
async def get_people(db: Session = Depends(get_db)):
    people = db.query(Item).all()
    return {'status': 'success', 'results': len(people), 'items': people}

@router.get("/healthcheck")
def root():
    return {'message': 'Hello World from router'}