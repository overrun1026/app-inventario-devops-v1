from conexion import conectar


def buscar_id(producto_id):

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
        WHERE id = %s;
    """

    cursor.execute(consulta, (producto_id,))

    producto = cursor.fetchone()

    cursor.close()
    conexion.close()

    if producto is None:
        return None

    return {
        "id": producto[0],
        "nombre": producto[1],
        "marca": producto[2],
        "descripcion": producto[3],
        "precio_compra": producto[4],
        "precio_venta": producto[5],
        "fecha_creacion": producto[6]
    }