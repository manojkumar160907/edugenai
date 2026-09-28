import os

from dotenv import load_dotenv
from google import genai


# --------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# --------------------------------------------------

load_dotenv()


API_KEY = os.getenv(
    "GEMINI_API_KEY",
    ""
).strip()


MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.5-flash-lite"
).strip()


# --------------------------------------------------
# GEMINI CLIENT
# --------------------------------------------------

client = None

if API_KEY:

    client = genai.Client(
        api_key=API_KEY
    )


# --------------------------------------------------
# TASK INSTRUCTIONS
# --------------------------------------------------

TASK_INSTRUCTIONS = {

    "qa": """
Answer the student's question clearly.

Give:
1. Direct answer
2. Simple explanation
3. Example if useful

Use simple language suitable for a college student.
""",

    "explain": """
Explain the requested topic like a friendly college teacher.

Include:
1. Definition
2. Simple explanation
3. Step-by-step explanation
4. Example
5. Important points to remember
""",

    "quiz": """
Create exactly 5 multiple-choice questions.

Each question must contain:

Question
A)
B)
C)
D)

Correct Answer:
Explanation:

Make the questions suitable for a college student.
""",

    "summarize": """
Summarize the supplied educational text.

Keep:
- Important concepts
- Definitions
- Key facts
- Important steps
- Useful examples

Use clear headings and bullet points.
""",

    "learn": """
Create a personalized learning path.

Include:

1. Prerequisites
2. Beginner topics
3. Intermediate topics
4. Advanced topics
5. 7-day study plan
6. Practice activities
7. Final revision checklist

Make it suitable for a college student.
"""
}


# --------------------------------------------------
# GENERATE RESPONSE
# --------------------------------------------------

def generate_ai_response(
    task: str,
    prompt: str
):

    task = task.lower().strip()


    # Check API key

    if not API_KEY:

        raise ValueError(
            "GEMINI_API_KEY is missing. "
            "Create a .env file and add your Gemini API key."
        )


    # Check client

    if client is None:

        raise ValueError(
            "Gemini client could not be created."
        )


    # Check task

    if task not in TASK_INSTRUCTIONS:

        raise ValueError(
            "Unknown task. "
            "Use qa, explain, quiz, summarize, or learn."
        )


    instructions = TASK_INSTRUCTIONS[task]


    # --------------------------------------------------
    # PROMPT
    # --------------------------------------------------

    full_prompt = f"""

You are EduGenie,
an AI educational assistant for college students.

Your goal is to help students understand subjects
in a simple, accurate and useful way.

Use clean Markdown formatting.

Do not use HTML.

Do not invent information.

TASK:

{instructions}


STUDENT INPUT:

{prompt}

"""


    # --------------------------------------------------
    # GEMINI REQUEST
    # --------------------------------------------------

    response = client.models.generate_content(

        model="gemini-3.5-flash-lite",

        contents=full_prompt

    )


    # --------------------------------------------------
    # RESPONSE TEXT
    # --------------------------------------------------

    result = getattr(
        response,
        "text",
        None
    )


    if not result:

        raise RuntimeError(
            "Gemini returned an empty response."
        )


    return result.strip()