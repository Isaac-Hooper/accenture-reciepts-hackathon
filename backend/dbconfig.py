from datetime import datetime

import sqlalchemy
from sqlalchemy import create_engine, select
from sqlalchemy import (
    create_engine,
    String,
    Integer,
    Float,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker, selectinload

engine = create_engine("sqlite:///receipts_db", echo=True)

SessionLocal = sessionmaker(
    bind = engine,
    autocommit = False,
    autoflush = False,
)

#Pydantic Definitions (for prompt)
from pydantic import BaseModel


class PromptReceiptItem(BaseModel):
    name: str
    quantity: int
    unit_price: float
    category: str


class PromptReceiptData(BaseModel):
    timestamp: str
    items: list[PromptReceiptItem]


#Table Definitions
class Base(DeclarativeBase):
    pass

class Receipt(Base):
    __tablename__ = "receipts"

    id: Mapped[int] = mapped_column(primary_key=True)
    timestamp: Mapped[datetime] = mapped_column()
    image_path: Mapped[str] = mapped_column()

    items: Mapped[list["Item"]] = relationship(
        cascade="all, delete-orphan",
        back_populates="receipt"
    )


class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True)

    receipt_id: Mapped[int] = mapped_column(
        ForeignKey("receipts.id"),
        index=True
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        index=True
    )

    name: Mapped[str] = mapped_column(String(255))

    quantity: Mapped[int] = mapped_column(default = 1)

    unit_price: Mapped[float] = mapped_column(Float)

    receipt: Mapped["Receipt"] = relationship(
        back_populates="items"
    )

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

    items: Mapped[list["Item"]] = relationship(
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
            session.merge(Category(id=id, name=name))
            session.commit()

def add_receipt(receipt_json, image_path):
    with SessionLocal() as session:

        #Create Receipt
        receipt = Receipt(
            timestamp = datetime.fromisoformat(receipt_json["timestamp"]),
            image_path = image_path,
        )

        session.add(receipt)
        session.flush()

        #Create Items
        for item_data in receipt_json["items"]:

            category = session.scalar(
                select(Category).where(
                    Category.name == item_data["category"]
                )
            )

            if category is None:
                category = Category(
                    name=item_data["category"]
                )
                session.add(category)
                session.flush()

            item = Item(
                receipt_id=receipt.id,
                category_id=category.id,
                name=item_data["name"],
                quantity=item_data.get("quantity", 1),
                unit_price=item_data["unit_price"],
            )

            receipt.items.append(item)
            session.commit()

def get_all_receipts():
    with SessionLocal() as session:
        receipts = session.scalars(
            select(Receipt)
            .options(
                selectinload(Receipt.items)
                .selectinload(Item.category)
            )
        ).all()


        result = []

        for receipt in receipts:
            result.append({
                "id": receipt.id,
                "timestamp": receipt.timestamp.isoformat(),
                "image_path": receipt.image_path,
                "items": [
                    {
                        "id": item.id,
                        "name": item.name,
                        "quantity": item.quantity,
                        "unit_price": item.unit_price,
                        "category": item.category.name,
                    }
                    for item in receipt.items
                ]
            })

        return result

