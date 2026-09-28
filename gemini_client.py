import os

from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()


SYSTEM_INSTRUCTION = """
You are EduGenie, an AI-powered educational assistant.

Your job is to help students learn difficult topics in simple,
clear and understandable language.

Always:
- Give accurate educational answers.
- Explain difficult concepts step by step.
- Use examples when useful.
- Avoid unnecessary complicated language.
- Do not invent facts.
- Keep answers focused on the student's request.
"""


def get_client():

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is missing. Please add it to the .env file."
        )

    return genai.Client(api_key=api_key)


def generate_text(
    prompt,
    temperature=0.4,
    max_output_tokens=1200
):

    client = get_client()

    model = os.getenv(
        "GEMINI_MODEL",
        "gemini-3.8-flash"
    )

    response = client.models.generate_content(

        model=model,

        contents=prompt,

        config=types.GenerateContentConfig(

            system_instruction=SYSTEM_INSTRUCTION,

            temperature=temperature,

            max_output_tokens=max_output_tokens
        )
    )

    result = getattr(response, "text", None)

    if not result:
        raise RuntimeError(
            "Gemini returned an empty response."
        )

    return result.strip()


def generate_json(
    prompt,
    schema
):

    client = get_client()

    model = os.getenv(
        "GEMINI_MODEL",
        "gemini-3.8-flash"
    )

    response = client.models.generate_content(

        model=model,

        contents=prompt,

        config=types.GenerateContentConfig(

            system_instruction=SYSTEM_INSTRUCTION,

            temperature=0.3,

            max_output_tokens=1800,

            response_mime_type="application/json",

            response_schema=schema
        )
    )

    result = getattr(response, "text", None)

    if not result:
        raise RuntimeError(
            "Gemini returned an empty response."
        )

    return result.strip()