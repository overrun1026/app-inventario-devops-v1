from conexion import conectar


def listar():

    conexion = conectar()
    cursor = conexion.cursor()

    consulta = """
        SELECT
            id,
            nombre,
            marca,
            descripcion,
            precio_compra,
            precio_venta,
            fecha_creacion
        FROM productos
        ORDER BY id DESC;
    """

    cursor.execute(consulta)

    productos = cursor.fetchall()

    cursor.close()
    conexion.close()

    return [
        {
            "id": producto[0],
            "nombre": producto[1],
            "marca": producto[2],
            "descripcion": producto[3],
            "precio_compra": producto[4],
            "precio_venta": producto[5],
            "fecha_creacion": producto[6]
        }
        for producto in productos
    ]