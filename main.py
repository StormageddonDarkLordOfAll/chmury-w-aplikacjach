import uvicorn
from fastapi import FastAPI
from model import *
import psycopg2
from psycopg2.extras import RealDictCursor, DictCursor
from config import settings

app = FastAPI()
DATABASE_URL = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOSTNAME}:{settings.DATABASE_PORT}/{settings.POSTGRES_DB}"
conn = psycopg2.connect(DATABASE_URL)


def create_table():
    cursor = conn.cursor()

    sql = '''DROP TABLE IF EXISTS people CASCADE'''
    # # Executing the query

    sql2 = '''
    CREATE TABLE people (
        ID SERIAL PRIMARY KEY,
        country varchar(255),
        year int,
        continent varchar(255),
        least_developed boolean,
        life_expectancy float,
        population int,
        co2_emissions float,
        health_expenditure float,
        electric_power_consumption float,
        forest_area float,
        gdp_per_capita float,
        individuals_using_the_internet float,
        military_expenditure float,
        people_practicing_open_defecation float,
        people_using_at_least_basic_drinking_water_services float,
        obesity_among_adults float,
        beer_consumption_per_capita float
    )'''

    try:
        cursor.execute(sql)
        cursor.execute(sql2)
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

def import_data_to_table():
    cursor = conn.cursor()
    sql = f'''COPY people(country,year,continent,least_developed,life_expectancy,\
        population,co2_emissions,health_expenditure,electric_power_consumption,\
            forest_area,gdp_per_capita,individuals_using_the_internet,military_expenditure,\
                people_practicing_open_defecation,people_using_at_least_basic_drinking_water_services,\
                    obesity_among_adults,beer_consumption_per_capita)
    FROM '{settings.CSV_DATASET}'
    DELIMITER ';'
    CSV HEADER;'''

    try:
        cursor.execute(sql)
        # conn.commit()

        # sql3 = '''select * from people;'''
        # cursor.execute(sql3)
        # for i in cursor.fetchall():
        #     print(i)
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


@app.post("/people/")
async def create_item(item: Item):
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO people (country,year,continent,least_developed,life_expectancy,\
        population,co2_emissions,health_expenditure,electric_power_consumption,\
            forest_area,gdp_per_capita,individuals_using_the_internet,military_expenditure,\
                people_practicing_open_defecation,people_using_at_least_basic_drinking_water_services,\
                    obesity_among_adults,beer_consumption_per_capita)\
                          VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
        (item.country, item.year, item.continent, item.least_developed, item.life_expectancy,\
         item.population, item.co2_emissions, item.health_expenditure, item.electric_power_consumption,\
            item.forest_area, item.gdp_per_capita, item.individuals_using_the_internet, item.military_expenditure,\
                item.people_practicing_open_defecation, item.people_using_at_least_basic_drinking_water_services,\
                    item.obesity_among_adults, item.beer_consumption_per_capita)
    )
    item_id = cursor.fetchone()[0]
    conn.commit()
    return {"id": item_id}


@app.get("/people/")
async def get_people(country: Optional[str] = None):
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    sql = "SELECT * FROM people"
    if country is not None:
        sql += " WHERE country = '" + country + "'"
    cursor.execute(sql)
    people = cursor.fetchall()
    return people

create_table()
import_data_to_table()

uvicorn.run(app, host="0.0.0.0", port=8000)