from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

from ai_service import generate_ai_response


# --------------------------------------------------
# APP
# --------------------------------------------------

app = FastAPI(
    title="EduGenie",
    description="Gemini Powered AI Learning Assistant",
    version="2.0.0"
)


# --------------------------------------------------
# STATIC FILES
# --------------------------------------------------

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


# --------------------------------------------------
# TEMPLATES
# --------------------------------------------------

templates = Jinja2Templates(
    directory="templates"
)


# --------------------------------------------------
# REQUEST MODEL
# --------------------------------------------------

class AskRequest(BaseModel):

    task: str = Field(
        ...,
        min_length=1,
        max_length=40
    )

    prompt: str = Field(
        ...,
        min_length=1,
        max_length=30000
    )


# --------------------------------------------------
# HOME PAGE
# --------------------------------------------------

@app.get(
    "/",
    response_class=HTMLResponse
)
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
async def health():

    return {
        "status": "ok",
        "service": "EduGenie",
        "model": "gemini-3.5-flash-lite"
    }


# --------------------------------------------------
# MAIN AI API
# --------------------------------------------------

@app.post("/api/ask")
async def ask(request: AskRequest):

    try:

        result = generate_ai_response(
            request.task,
            request.prompt
        )

        return {
            "ok": True,
            "result": result
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        print("AI ERROR:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )