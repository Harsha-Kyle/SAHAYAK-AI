from app.db.database import Base, engine

def test_database_connection_and_schema():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        assert conn is not None
