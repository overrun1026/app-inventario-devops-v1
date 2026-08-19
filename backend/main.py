from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from agregar import agregar
from buscar_id import buscar_id
from buscar_nombre import buscar_nombre
from editar import editar
from eliminar import eliminar
from listar import listar

from models import ProductoCreate, ProductoUpdate


app = FastAPI(
    title="Inventario API",
    description="API REST para sistema de inventario",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():

    return {
        "status": "ok",
        "message": "API funcionando correctamente"
    }


# ==========================================
# LISTAR
# ==========================================

@app.get("/productos")
def obtener_productos():

    return listar()


# ==========================================
# BUSCAR POR ID
# ==========================================

@app.get("/productos/id/{producto_id}")
def obtener_producto_id(producto_id: int):

    producto = buscar_id(producto_id)

    if producto is None:

        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )

    return producto


# ==========================================
# BUSCAR POR NOMBRE
# ==========================================

@app.get("/productos/nombre/{nombre}")
def obtener_producto_nombre(nombre: str):

    return buscar_nombre(nombre)


# ==========================================
# AGREGAR
# ==========================================

@app.post("/productos")
def crear_producto(
    producto: ProductoCreate
):

    return agregar(producto)


# ==========================================
# EDITAR PARCIALMENTE
# ==========================================

@app.patch("/productos/{producto_id}")
def actualizar_producto(
    producto_id: int,
    cambios: ProductoUpdate
):

    datos = cambios.model_dump(
        exclude_none=True
    )


    if not datos:

        raise HTTPException(
            status_code=400,
            detail="No se proporcionaron cambios"
        )


    producto = editar(
        producto_id,
        datos
    )


    if producto is None:

        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )


    return producto


# ==========================================
# ELIMINAR
# ==========================================

@app.delete("/productos/{producto_id}")
def borrar_producto(
    producto_id: int
):

    producto = eliminar(
        producto_id
    )


    if producto is None:

        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )


    return {
        "message": "Producto eliminado correctamente",
        "producto": producto
    }