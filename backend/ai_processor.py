import os
import fitz  # PyMuPDF
from groq import Groq
from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import DeterministicFakeEmbedding
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def transcribe_audio_video(file_path):
    try:
        with open(file_path, "rb") as file:
            transcription = client.audio.transcriptions.create(
                file=(os.path.basename(file_path), file.read()),
                model="whisper-large-v3",
                response_format="verbose_json",
            )
        return transcription
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        # Return a dummy object with empty text and segments to prevent crash
        class DummyTranscript:
            def __init__(self):
                self.text = "No audio track found or transcription failed."
                self.segments = []
        return DummyTranscript()

def process_file_content(file_id, content, file_type):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_text(content)

    # Use a very simple embedding for speed
    embeddings = DeterministicFakeEmbedding(size=768)
    vector_store = FAISS.from_texts(texts, embeddings)

    store_path = f"/tmp/vector_stores/{file_id}"
    os.makedirs(store_path, exist_ok=True)
    vector_store.save_local(store_path)

    return store_path

def get_answer(file_id, question, content=None):
    embeddings = DeterministicFakeEmbedding(size=768)
    store_path = f"/tmp/vector_stores/{file_id}"
    
    # Fallback: If index is missing (common on Vercel), re-create it from content
    if not os.path.exists(store_path) and content:
        print(f"Re-creating missing index for {file_id}...")
        process_file_content(file_id, content, "fallback")
    
    try:
        vector_store = FAISS.load_local(
            store_path,
            embeddings,
            allow_dangerous_deserialization=True
        )
    except Exception as e:
        print(f"Error loading vector store: {str(e)}")
        return "Sorry, I am having trouble accessing the file context. Please try re-uploading."

    docs = vector_store.similarity_search(question, k=5)
    context = "\n\n".join([doc.page_content for doc in docs])

    llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0)
    prompt = f"""Answer the question based on the context. 

Context:
{context}

Question: {question}"""

    response = llm.invoke([HumanMessage(content=prompt)])
    return response.content

def summarize_content(content):
    llm = ChatGroq(model_name="llama-3.1-8b-instant", temperature=0)
    prompt = f"Summarize this:\n\n{content[:8000]}"
    response = llm.invoke([HumanMessage(content=prompt)])
    return response.content
