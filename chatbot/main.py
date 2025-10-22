# app_merged.py
import os
import json
import re
import traceback
from typing import Optional, Tuple

from flask import Flask, request, jsonify

# LangChain + models
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# =========================
# ======== CONFIG =========
# =========================
# ⚠️ Hard-code API key (demo/test). KHÔNG dùng cho production.
OPENAI_API_KEY = "your_openai_api_key_here" # Thay bằng API key thật của bạn
OPENAI_MODEL = "gpt-4.1"

# FAISS: đặt đúng thư mục index bạn đã lưu
FAISS_CANDIDATES: Tuple[Tuple[str, Optional[str]], ...] = (
    ("faiss_vi_db",  "index"),   # theo app1
    ("./faiss_db", None),                 # theo app2
)

print(FAISS_CANDIDATES)

EMBED_MODEL = "keepitreal/vietnamese-sbert"
DEFAULT_K = 5
DEFAULT_TEMPERATURE = 0.2

PROFILE_PATH = "user_profile.json"  # phục vụ /chat

# =========================
# ====== PROMPTS ==========
# =========================
ANALYZE_PROMPT = PromptTemplate(
    template=(
        """
Bạn là chuyên gia phân tích hành vi. Dựa vào thông tin trong tài liệu và lịch sử trò chuyện,
hãy phân tích dựa trên mô hình CBT và trả về kết quả dưới dạng JSON với 3 trường, lưu ý là đối với advise chỉ tập trung vào khuyên người dùng thôi:
- emotion: (Cảm xúc)
- thought: (Suy nghĩ)
- behavior: (Hành vi)
- advise: (Lời khuyên)

CÂU HỎI: {question}
CONTEXT:
{context}

Chỉ trả về JSON, không thêm bất kỳ giải thích hoặc ký tự nào khác.
Ví dụ:
{{
    "emotion": "...",
    "thought": "...",
    "behavior": "...",
    "advise": "..."
}}
        """.strip()
    ),
    input_variables=["question", "context"],
)

CHAT_PROMPT = PromptTemplate(
    template=(
        """
Bạn là chatbot tư vấn tâm lý. Dựa trên LỊCH SỬ HỘI THOẠI và CONTEXT, hãy trả lời một cách ngắn gọn, xúc tích, mang tính chuyên môn, hãy đồng hành cùng thân chủ.

LỊCH SỬ HỘI THOẠI:
{question}

CONTEXT:
{context}
        """.strip()
    ),
    input_variables=["question", "context"],
)

# =========================
# ====== APP & GLOBAL =====
# =========================
app = Flask(__name__)

embeddings = None
vectordb = None

# =========================
# ====== UTILITIES ========
# =========================
def load_profile():
    if os.path.exists(PROFILE_PATH):
        with open(PROFILE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"name": None}

def clean_text_basic(s: str) -> str:
    """Giữ chữ/số/khoảng trắng + dấu câu thông dụng (lọc output /chat)."""
    return re.sub(r"[^a-zA-ZÀ-ỹ0-9\s\.,;:!?()\-]", "", s).strip()

def init_embeddings():
    global embeddings
    if embeddings is None:
        embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
    return embeddings

def try_load_faiss():
    """Thử lần lượt các cấu hình FAISS đã nêu, trả về vectordb đầu tiên load được."""
    init_embeddings()
    last_err = None
    for folder_path, index_name in FAISS_CANDIDATES:
        try:
            if index_name:
                db = FAISS.load_local(
                    folder_path,
                    embeddings=embeddings,
                    index_name=index_name,
                    allow_dangerous_deserialization=True,
                )
            else:
                db = FAISS.load_local(
                    folder_path,
                    embeddings=embeddings,
                    allow_dangerous_deserialization=True,
                )
            print(f"[FAISS] Loaded successfully from {folder_path} "
                  f"{'(index=' + index_name + ')' if index_name else ''}")
            return db
        except Exception as e:
            last_err = e
            print(f"[FAISS] Failed to load from {folder_path}"
                  f"{' (index=' + index_name + ')' if index_name else ''}: {e}")
    raise RuntimeError(f"Could not load any FAISS index. Last error: {last_err}")

def get_vectordb():
    global vectordb
    if vectordb is None:
        vectordb = try_load_faiss()
    return vectordb

def make_llm(temperature: Optional[float] = None):
    """Tạo ChatOpenAI với API key cứng."""
    return ChatOpenAI(
        model=OPENAI_MODEL,
        temperature=float(DEFAULT_TEMPERATURE if temperature is None else temperature),
        api_key=OPENAI_API_KEY,
    )

def build_qa_chain(prompt: PromptTemplate, k: int = DEFAULT_K, temperature: Optional[float] = None,
                   return_sources: bool = False):
    db = get_vectordb()
    retriever = db.as_retriever(search_kwargs={"k": k})
    llm = make_llm(temperature=temperature)
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": prompt},
        return_source_documents=return_sources,
    )
    return qa

# =========================
# ========= ROUTES ========
# =========================
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json(force=True)
        question = (data or {}).get("question", "").strip()
        print(f"[ANALYZE] Received question: {question}")
        if not question:
            return jsonify({"error": "Missing 'question' field"}), 400

        k = int((data or {}).get("k", DEFAULT_K))
        temperature = (data or {}).get("temperature", None)

        qa_json = build_qa_chain(
            prompt=ANALYZE_PROMPT,
            k=k,
            temperature=temperature,
            return_sources=False,
        )

        raw_answer = qa_json.run(question)

        # Cố gắng extract JSON {...}
        try:
            match = re.search(r"\{.*\}", raw_answer, re.DOTALL)
            if not match:
                raise json.JSONDecodeError("No JSON object found", raw_answer, 0)

            parsed = json.loads(match.group(0))

            return jsonify({
                "question": question,
                "emotion": parsed.get("emotion", ""),
                "thought": parsed.get("thought", ""),
                "behavior": parsed.get("behavior", ""),
                "advise": parsed.get("advise", "")
            }), 200

        except json.JSONDecodeError:
            # Trả lại raw_answer để client tự xử lý nếu cần
            return jsonify({
                "question": question,
                "raw_answer": raw_answer,
                "error": "Model did not return valid JSON"
            }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/chat", methods=["POST"])
def chat():
    """
    Body JSON:
    {
      "question": "Câu hỏi mới",
      "history": [{"role": "user/assistant", "content": "..."}],  # optional
      "k": 5,                     # optional
      "temperature": 0.2,         # optional
      "name_override": "Bình"     # optional
    }
    """
    try:
        data = request.get_json(force=True) or {}

        k = int(data.get("k", DEFAULT_K))
        temperature = data.get("temperature", None)
        name_override = data.get("name_override", None)
        history_list = data.get("history", [])
        new_q = data.get("question", "")

        history_str = "\n".join([f"{msg.get('role','')}: {msg.get('content','')}" for msg in history_list])
        combined_query = f"{history_str}\nCâu hỏi mới: {new_q}".strip()

        qa_chat = build_qa_chain(
            prompt=CHAT_PROMPT,
            k=k,
            temperature=temperature,
            return_sources=True,
        )

        result = qa_chat({"query": combined_query})
        answer = result.get("result", "")

        # lọc ký tự đặc biệt
        answer = clean_text_basic(answer)

        sources = []
        for doc in result.get("source_documents", []) or []:
            src = doc.metadata.get("source") or doc.metadata.get("file_path") or "unknown"
            sources.append({"source": src})

        profile = load_profile()
        display_name = name_override or profile.get("name")
        if display_name:
            if not answer.lower().startswith(str(display_name).lower()):
                answer = f"{display_name}, {answer}"

        return jsonify({"answer": answer, "sources": sources}), 200

    except Exception as e:
        print("Lỗi /chat:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# =========================
# ========= MAIN ==========
# =========================
if __name__ == "__main__":
    try:
        get_vectordb()
    except Exception as e:
        print("[FATAL] Không thể load FAISS:", e)
        raise

    app.run(host="0.0.0.0", port=8000, debug=True)
    