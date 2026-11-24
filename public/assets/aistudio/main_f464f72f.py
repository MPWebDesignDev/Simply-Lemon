import json
from typing import List
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db, engine
import models
from agent1_strategy import run_strategy_agent
from agent2_designer import run_designer_agent
from agent3_copywriter import run_copywriting_agent


# --- Schemas Pydantic para o PhotoBatch (lote de fotos) ---
class PhotoBatchCreate(BaseModel):
    brand_id: int
    images_paths: List[str]  # Lista de caminhos/URLs das fotos enviadas pelo utilizador


class PhotoBatchResponse(BaseModel):
    id: int
    brand_id: int
    images_paths: List[str]
    created_at: datetime

# Cria as tabelas na base de dados automaticamente ao iniciar a app
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Simply Lemon API")

@app.get("/")
def read_root():
    return {"status": "sucesso", "mensagem": "Olá! O motor do Simply Lemon está vivo!"}

@app.get("/gerar-estrategia")
def gerar_estrategia():
    print("A aplicação pediu apenas uma estratégia...")
    resultado = run_strategy_agent()
    return {"status": "sucesso", "dados": resultado}

# A ROTA: A linha de montagem completa com persistência na BD!
@app.get("/gerar-campanha-completa")
def gerar_campanha_completa(db: Session = Depends(get_db)):
    print("\n🚀 --- INÍCIO DA LINHA DE MONTAGEM ---")
    
    # Passo 1: O Estrategista define o plano
    print("1. A acordar o Agente 1 (Estrategista)...")
    plano_estrategico = run_strategy_agent()
    
    # Passo 2: O Designer prepara os visuais com base no plano
    print("2. A passar o plano ao Agente 2 (Designer)...")
    specs_design = run_designer_agent(strategy_plan=plano_estrategico)
    
    # Passo 3: O Copywriter escreve os textos com base no plano
    print("3. A passar o plano ao Agente 3 (Copywriter)...")
    textos_finais = run_copywriting_agent(user_language="pt-PT", strategy_plan=plano_estrategico)
    
    print("✅ --- LINHA DE MONTAGEM CONCLUÍDA ---\n")
    
    # Pacote completo gerado pela IA
    campanha_completa = {
        "estrategia_geral": plano_estrategico,
        "especificacoes_visuais": specs_design,
        "textos_publicacoes": textos_finais
    }
    
    # Guardar automaticamente na base de dados PostgreSQL
    try:
        nova_campanha = models.CampaignModel(
            strategy_summary=str(plano_estrategico)[:255], # Um breve resumo ou título
            full_json_data=str(campanha_completa)         # O pacote completo em formato de texto/JSON
        )
        db.add(nova_campanha)
        db.commit()
        db.refresh(nova_campanha)
        print(f"💾 Campanha guardada com sucesso na BD com o ID: {nova_campanha.id}")
        campanha_id = nova_campanha.id
    except Exception as e:
        db.rollback()
        print(f"❌ Erro ao guardar na base de dados: {e}")
        campanha_id = None

    # Devolvemos o pacote completo e o ID de registo
    return {
        "status": "sucesso",
        "database_id": campanha_id,
        "campanha_completa": campanha_completa
    }


# --- Rotas para o PhotoBatch (lote de fotos) ---

@app.post("/photo-batches", response_model=PhotoBatchResponse, status_code=201)
def criar_photo_batch(batch: PhotoBatchCreate, db: Session = Depends(get_db)):
    """Recebe um novo lote de fotos e guarda-o na base de dados PostgreSQL."""
    # Confirma que a marca (brand) existe antes de associar o lote
    brand = db.query(models.BrandProfile).filter(
        models.BrandProfile.id == batch.brand_id
    ).first()
    if brand is None:
        raise HTTPException(status_code=404, detail="BrandProfile não encontrado")

    # Os caminhos das fotos são guardados como texto JSON na coluna Text
    novo_batch = models.PhotoBatch(
        brand_id=batch.brand_id,
        images_paths=json.dumps(batch.images_paths),
    )
    db.add(novo_batch)
    db.commit()
    db.refresh(novo_batch)

    return PhotoBatchResponse(
        id=novo_batch.id,
        brand_id=novo_batch.brand_id,
        images_paths=batch.images_paths,
        created_at=novo_batch.created_at,
    )


@app.get("/photo-batches/{batch_id}", response_model=PhotoBatchResponse)
def obter_photo_batch(batch_id: int, db: Session = Depends(get_db)):
    """Devolve um lote de fotos específico a partir do seu ID."""
    batch = db.query(models.PhotoBatch).filter(
        models.PhotoBatch.id == batch_id
    ).first()
    if batch is None:
        raise HTTPException(status_code=404, detail="PhotoBatch não encontrado")

    # Reconverte o texto JSON guardado numa lista de caminhos
    try:
        paths = json.loads(batch.images_paths) if batch.images_paths else []
    except (ValueError, TypeError):
        # Compatibilidade com registos antigos guardados como texto simples
        paths = [batch.images_paths] if batch.images_paths else []

    return PhotoBatchResponse(
        id=batch.id,
        brand_id=batch.brand_id,
        images_paths=paths,
        created_at=batch.created_at,
    )