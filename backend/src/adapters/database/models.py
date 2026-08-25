from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

class TelemetryRecord(Base):
    __tablename__ = "telemetries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    device_id = Column(String(50), default="PINGOSOLAR-01", index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    water_temp_c = Column(Float, nullable=False)
    glass_temp_c = Column(Float, nullable=False)
    ambient_temp_c = Column(Float, default=28.0)
    solar_irradiance_w_m2 = Column(Float, default=800.0)
    relative_humidity = Column(Float, default=50.0)
    tds_value_mg_l = Column(Float, default=140.0)
    flow_rate_l_h = Column(Float, default=0.42)
    accumulated_liters_day = Column(Float, default=4.2)
    is_synced = Column(Boolean, default=True)

class SanitaryAlertRecord(Base):
    __tablename__ = "sanitary_alerts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    device_id = Column(String(50), default="PINGOSOLAR-01")
    timestamp = Column(DateTime, default=datetime.utcnow)
    alert_type = Column(String(50), nullable=False)
    severity = Column(String(20), default="WARNING")
    title = Column(String(150), nullable=False)
    description = Column(String(500), nullable=False)
    action_required = Column(String(300), nullable=True)
    resolved = Column(Boolean, default=False)

DATABASE_URL = "sqlite:///./pingosolar.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
