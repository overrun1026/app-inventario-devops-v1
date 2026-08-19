from conexion import conectar


def eliminar(producto_id):

    conexion = conectar()
    cursor = conexion.cursor()

    consulta = """
        DELETE FROM productos
        WHERE id = %s
        RETURNING
            id,
            nombre,
            marca,
            descripcion,
            precio_compra,
            precio_venta,
            fecha_creacion;
    """

    cursor.execute(consulta, (producto_id,))

    resultado = cursor.fetchone()

    conexion.commit()

    cursor.close()
    conexion.close()

    if resultado is None:
        return None

    return {
        "id": resultado[0],
        "nombre": resultado[1],
        "marca": resultado[2],
        "descripcion": resultado[3],
        "precio_compra": resultado[4],
        "precio_venta": resultado[5],
        "fecha_creacion": resultado[6]
    }