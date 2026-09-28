import json

from gemini_client import generate_json


QUIZ_SCHEMA = {

    "type": "array",

    "minItems": 3,

    "maxItems": 3,

    "items": {

        "type": "object",

        "properties": {

            "question": {
                "type": "string"
            },

            "options": {

                "type": "array",

                "minItems": 4,

                "maxItems": 4,

                "items": {
                    "type": "string"
                }
            },

            "correct_answer": {
                "type": "string"
            },

            "explanation": {
                "type": "string"
            }
        },

        "required": [
            "question",
            "options",
            "correct_answer",
            "explanation"
        ]
    }
}


def generate_quiz(passage):

    prompt = f"""
Create exactly 3 multiple-choice questions
from the following educational passage.

PASSAGE:

{passage}

Rules:

- Create exactly 3 questions.
- Each question must have exactly 4 options.
- Only one answer must be correct.
- correct_answer must exactly match one option.
- Add a short explanation.
- Questions must be based on the provided passage.
- Return only JSON.
"""

    response = generate_json(
        prompt,
        QUIZ_SCHEMA
    )

    try:

        quiz = json.loads(response)

    except json.JSONDecodeError as error:

        raise RuntimeError(
            f"Quiz JSON parsing failed: {error}"
        )

    if len(quiz) != 3:

        raise RuntimeError(
            "Quiz must contain exactly 3 questions."
        )

    for question in quiz:

        if len(question["options"]) != 4:

            raise RuntimeError(
                "Each question must have 4 options."
            )

        if question["correct_answer"] not in question["options"]:

            raise RuntimeError(
                "Correct answer must match an option."
            )

    return quiz