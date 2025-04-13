from litellm import completion
import os
from dotenv import load_dotenv
import sys
import json

# Load environment variables from .env file
load_dotenv()

os.environ['DEEPSEEK_API_KEY'] = os.getenv('DEEPSEEK_API_KEY')

INITIAL_PROMPT = ""
with open("./deepseek/initial_prompt.txt", "r") as f:
    INITIAL_PROMPT = f.read()


def deepseek(content: str):
    response = completion(
        model="deepseek/deepseek-chat", 
        messages=[
            {"role": "user", "content": INITIAL_PROMPT+ content}
        ]
    )
    return response.choices[0].message["content"]

input_data = json.loads(sys.stdin.read())
result = deepseek(input_data['content'])
print(json.dumps({ "response": result }))

