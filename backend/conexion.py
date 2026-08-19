import os

import psycopg2

from dotenv import load_dotenv


# Cargar variables del archivo .env
load_dotenv()


def conectar():

    conexion = psycopg2.connect(
        host=os.getenv("ENV_HOST"),
        port=os.getenv("ENV_PORT"),
        database=os.getenv("ENV_DATABASE"),
        user=os.getenv("ENV_USER"),
        password=os.getenv("ENV_PASSWORD")
    )

    return conexion