from gemini_client import generate_text


def get_learning_recommendations(topic):

    prompt = f"""
Create a structured learning path for:

{topic}

Organize it into:

1. Beginner Level
2. Intermediate Level
3. Advanced Level
4. Suggested Timeline
5. Practice Activities
6. Project Ideas
7. Recommended Resource Types

The learner should progress step by step.

Keep the learning path practical and easy to follow.

Do not invent specific URLs.
"""

    return generate_text(
        prompt,
        temperature=0.45,
        max_output_tokens=1400
    )