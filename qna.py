from gemini_client import generate_text


def answer_question(question):

    prompt = f"""
Answer the student's question clearly.

Student Question:
{question}

Instructions:

1. Start with the direct answer.
2. Explain the answer simply.
3. Give an example if useful.
4. Keep the response educational.
5. Do not add unnecessary information.
"""

    return generate_text(
        prompt,
        temperature=0.35,
        max_output_tokens=1000
    )