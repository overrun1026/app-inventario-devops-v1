from conexion import conectar


def editar(producto_id, cambios):

    conexion = conectar()
    cursor = conexion.cursor()

    campos_permitidos = {
        "nombre": "nombre",
        "marca": "marca",
        "descripcion": "descripcion",
        "precio_compra": "precio_compra",
        "precio_venta": "precio_venta"
    }

    campos = cambios.keys()

    campos_validos = [
        campo
        for campo in campos
        if campo in campos_permitidos
    ]

    if not campos_validos:

        cursor.close()
        conexion.close()

        return None

    campo = campos_validos[0]

    valor = cambios[campo]

    consulta = f"""
        UPDATE productos
        SET {campos_permitidos[campo]} = %s
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

    cursor.execute(
        consulta,
        (
            valor,
            producto_id
        )
    )

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