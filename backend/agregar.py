from conexion import conectar


def agregar(producto):

    conexion = conectar()
    cursor = conexion.cursor()

    consulta = """
        INSERT INTO productos (
            nombre,
            marca,
            descripcion,
            precio_compra,
            precio_venta
        )
        VALUES (%s, %s, %s, %s, %s)
        RETURNING
            id,
            nombre,
            marca,
            descripcion,
            precio_compra,
            precio_venta,
            fecha_creacion;
    """

    valores = (
        producto.nombre,
        producto.marca,
        producto.descripcion,
        producto.precio_compra,
        producto.precio_venta
    )

    cursor.execute(consulta, valores)

    resultado = cursor.fetchone()

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "id": resultado[0],
        "nombre": resultado[1],
        "marca": resultado[2],
        "descripcion": resultado[3],
        "precio_compra": resultado[4],
        "precio_venta": resultado[5],
        "fecha_creacion": resultado[6]
    }