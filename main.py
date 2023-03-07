import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import *
from config import settings
from router import router
from database import Base, engine, get_db
from numpy import genfromtxt
import dbmodel

app = FastAPI()

origins = [
    settings.CLIENT_ORIGIN,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, tags=['People'], prefix='/api/people')

@app.get("/api/healthcheck")
def root():
    return {'message': 'Hello World'}

Base.metadata.create_all(engine)

def import_from_csv():
    db = next(get_db())
    try:
        data = genfromtxt(settings.CSV_DATASET, delimiter=';', skip_header=1, dtype=None, encoding=None).tolist()

        for i in data:
            record = dbmodel.Item(**{
                'country' : i[0],
                'year' : i[1],
                'continent' : i[2],
                'least_developed' : i[3],
                'life_expectancy' : i[4],
                'population' : i[5],
                'co2_emissions' : i[6],
                'health_expenditure' : i[7],
                'electric_power_consumption' : i[8],
                'forest_area' : i[9],
                'gdp_per_capita' : i[10],
                'individuals_using_the_internet' : i[11],
                'military_expenditure' : i[12],
                'people_practicing_open_defecation' : i[13],
                'people_using_at_least_basic_drinking_water_services' : i[14],
                'obesity_among_adults' : i[15],
                'beer_consumption_per_capita' : i[16]
            })
            db.add(record)
    except Exception as e:
        print('exception: ' + str(e))
        db.rollback()
    finally:
        db.commit()
        db.close()

# @app.post("/people/")
# async def create_item(item: Item):
#     cursor = conn.cursor()
#     cursor.execute(
#         "INSERT INTO people (country,year,continent,least_developed,life_expectancy,\
#         population,co2_emissions,health_expenditure,electric_power_consumption,\
#             forest_area,gdp_per_capita,individuals_using_the_internet,military_expenditure,\
#                 people_practicing_open_defecation,people_using_at_least_basic_drinking_water_services,\
#                     obesity_among_adults,beer_consumption_per_capita)\
#                           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
#         (item.country, item.year, item.continent, item.least_developed, item.life_expectancy,\
#          item.population, item.co2_emissions, item.health_expenditure, item.electric_power_consumption,\
#             item.forest_area, item.gdp_per_capita, item.individuals_using_the_internet, item.military_expenditure,\
#                 item.people_practicing_open_defecation, item.people_using_at_least_basic_drinking_water_services,\
#                     item.obesity_among_adults, item.beer_consumption_per_capita)
#     )
#     item_id = cursor.fetchone()[0]
#     conn.commit()
#     return {"id": item_id}


# @app.get("/people/")
# async def get_people(country: Optional[str] = None):
    # cursor = conn.cursor(cursor_factory=RealDictCursor)
    # sql = "SELECT * FROM people"
    # if country is not None:
    #     sql += " WHERE country = '" + country + "'"
    # cursor.execute(sql)
    # people = cursor.fetchall()
    # return people

import_from_csv()

uvicorn.run(app, host="0.0.0.0", port=8000)