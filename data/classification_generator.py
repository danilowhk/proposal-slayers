import json
from chatgpt import ChatGPT

# Initialize the ChatGPT class with your OpenAI API key and system prompt file path
chat_gpt = ChatGPT(api_key='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', filepath='prompt.txt')

# Load the JSON file
with open('aggregated_delegate_data.json') as f:
    data = json.load(f)

# Create a dictionary to store the responses
responses = {}

# Iterate through each delegate id
for delegate_id in data.keys():
    # Fetch delegate info
    delegate_info = data[delegate_id]
    # Convert delegate info to string format
    delegate_info_str = json.dumps(delegate_info, indent=4)
    # Use delegate info as prompt to chat with GPT-3
    response = chat_gpt.chat(delegate_info_str)
    # Save the response in the responses dictionary
    responses[delegate_id] = response

# Save the responses dictionary to a JSON file
with open('classified_delegates.json', 'w') as f:
    json.dump(responses, f, indent=4)
