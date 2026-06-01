from datetime import datetime

import sqlalchemy
from openai.types.moderation import Categories
from sqlalchemy import create_engine
from sqlalchemy import (
    create_engine,
    String,
    Integer,
    Float,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker

engine = create_engine("sqlite://", echo=True)

SessionLocal = sessionmaker(
    bind = engine,
    autocommit = False,
    autoflush = False,
)

#Table Definitions
class Base(DeclarativeBase):
    pass

class Receipt(Base):
    __tablename__ = "receipts"

    id: Mapped[int] = mapped_column(primary_key=True)
    datetime: Mapped[DateTime] = mapped_column()
    image_path: Mapped[str] = mapped_column()

    items: Mapped[list["Item"]] = relationship(
        cascade="all, delete-orphan"
    )


class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True)

    receipt_id: Mapped[int] = mapped_column(
        ForeignKey("receipts.id"),
        index=True
    )

    name: Mapped[str] = mapped_column(String(255))

    quantity: Mapped[int] = mapped_column(default = 1)

    unit_price: Mapped[float] = mapped_column(Float)

    category: Mapped["Category"] = relationship(
        back_populates="items"
    )



class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
    )

    items: Mapped[list["ReceiptItem"]] = relationship(
        back_populates="category"
    )

#Setup Functions
def init_db():
    Base.metadata.create_all(bind = engine)
    add_categories()

#List of all the categories
#TODO: Integrate into prompt
#TODO: Add more categories
PRESET_CATEGORIES = [
    (1, "Groceries"),
    (2, "Restaurant"),
    (3, "Beverages"),
    (4, "Household"),
    (5, "Other")
]

#Adds Categories to the database
def add_categories():
    with SessionLocal() as session:
        for id, name in PRESET_CATEGORIES:
            session.merge(Categories(id=id, name=name))




