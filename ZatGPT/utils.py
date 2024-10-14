from openai import AzureOpenAI
from django.conf import settings

client = AzureOpenAI(
    azure_endpoint=settings.OPENAI_AZURE_ENDPOINT,
    api_key=settings.OPENAI_API_KEY,
    api_version=settings.OPENAI_API_VERSION
)


def get_openai_response(messages):
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=messages
    )
    return response.choices[0].message.content
