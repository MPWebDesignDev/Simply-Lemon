from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class BrandProfile(Base):
    __tablename__ = "brand_profiles"

    id = Column(Integer, primary_key=True, index=True)
    auth_provider_id = Column(String, unique=True, index=True) # ID do Google/Apple Login
    brand_name = Column(String, nullable=False)
    color_palette = Column(String)                             # Ex: "#FF0000, #000000"
    brand_voice = Column(String)                               # Ex: "Jovem, divertido e direto"
    instagram_token = Column(String, nullable=True)            # Token para publicação automática
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relações
    batches = relationship("PhotoBatch", back_populates="brand")


class PhotoBatch(Base):
    __tablename__ = "photo_batches"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brand_profiles.id"))
    images_paths = Column(Text)                                # Caminhos das fotos enviadas pelo utilizador
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    brand = relationship("BrandProfile", back_populates="batches")
    posts = relationship("GeneratedPost", back_populates="batch")


class GeneratedPost(Base):
    __tablename__ = "generated_posts"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("photo_batches.id"))
    
    caption = Column(Text)                                     # O texto gerado pelo Copywriter
    image_url = Column(String)                                 # A imagem selecionada/criada para este post
    is_approved = Column(Integer, default=0)                   # 0 = Pendente, 1 = Aprovado pelo utilizador
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    batch = relationship("PhotoBatch", back_populates="posts")