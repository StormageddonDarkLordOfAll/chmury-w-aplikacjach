FROM continuumio/miniconda3

WORKDIR /app

COPY ./app .

RUN apt-get -y update\
&& apt-get -y upgrade\
&& pip install uvicorn fastapi pydantic[dotenv] sqlalchemy==1.4.32 psycopg2-binary numpy

CMD ["python3", "main.py"]