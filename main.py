import uvicorn
from fastapi import FastAPI
from model import *
import psycopg2
from psycopg2.extras import RealDictCursor, DictCursor
from config import settings
import json

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
    # finally:
    #     if conn is not None:
    #         conn.close()

def import_data_to_table():
    cursor = conn.cursor()
    sql = f'''COPY people(country,year,continent,least_developed,life_expectancy,population,co2_emissions,health_expenditure,electric_power_consumption,forest_area,gdp_per_capita,individuals_using_the_internet,military_expenditure,people_practicing_open_defecation,people_using_at_least_basic_drinking_water_services,obesity_among_adults,beer_consumption_per_capita)
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
    # finally:
    #     if conn is not None:
    #         conn.close()

# GET localhost:8000/items
@app.post("/items/")
async def create_item(item: Item):
    cursor.execute(
        "INSERT INTO items (name, description, price, tax) VALUES (%s, %s, %s, %s) RETURNING id",
        (item.name, item.description, item.price, item.tax)
    )
    item_id = cursor.fetchone()[0]
    conn.commit()
    return {"id": item_id}

# GET localhost:8000/items/{item_id}
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    cursor.execute(
        "SELECT name, description, price, tax FROM items WHERE id = %s",
        (item_id,)
    )
    item = cursor.fetchone()
    return {"id": item_id, "name": item[0], "description": item[1], "price": item[2], "tax": item[3]}


@app.get("/people/")
async def get_people():
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM people")
    people = cursor.fetchall()
    return people

create_table()
import_data_to_table()

get_people()

uvicorn.run(app, host="0.0.0.0", port=8000)