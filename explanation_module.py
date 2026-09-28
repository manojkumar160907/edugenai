from gemini_client import generate_text


def explain_topic(topic):

    prompt = f"""
Explain the following topic to a beginner.

Topic:
{topic}

Use this structure:

1. Simple Definition
2. How It Works
3. Real-World Example
4. Important Points

Use simple language.

Avoid unnecessary technical words unless
they are required to explain the topic.
"""

    return generate_text(
        prompt,
        temperature=0.35,
        max_output_tokens=1000
    )