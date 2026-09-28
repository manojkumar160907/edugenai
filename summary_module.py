from gemini_client import generate_text


def summarize_text(text):

    prompt = f"""
Summarize the following educational passage.

PASSAGE:

{text}

Requirements:

- Keep the main information.
- Remove repetition.
- Make it easy to revise.
- Use simple language.
- Use bullet points when helpful.
- Do not add information that isn't in the passage.
"""

    return generate_text(
        prompt,
        temperature=0.25,
        max_output_tokens=900
    )