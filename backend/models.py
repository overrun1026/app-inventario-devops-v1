from pydantic import BaseModel
from typing import Optional


class ProductoCreate(BaseModel):

    nombre: str
    marca: str
    descripcion: str
    precio_compra: float
    precio_venta: float


class ProductoUpdate(BaseModel):

    nombre: Optional[str] = None
    marca: Optional[str] = None
    descripcion: Optional[str] = None
    precio_compra: Optional[float] = None
    precio_venta: Optional[float] = None