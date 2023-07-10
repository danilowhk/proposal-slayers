import json
import traceback
from chatgpt import ChatGPT

# Initialize the ChatGPT class with your OpenAI API key and system prompt file path
chat_gpt = ChatGPT(api_key='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', filepath='prompt.txt')

# Load the JSON file
with open('aggregated_delegate_data.json') as f:
    data = json.load(f)

# Try to load existing classifications, if the file does not exist, create an empty dictionary
try:
    with open('classified_delegates.json') as f:
        responses = json.load(f)
except FileNotFoundError:
    responses = {}

# Iterate through each delegate id
for delegate_id in data.keys():
    # Skip if the delegate has already been classified
    if delegate_id in responses:
        print(f"Delegate {delegate_id}: Already exist")
        continue

    try:
        # Fetch delegate info
        delegate_info = data[delegate_id]
        # Convert delegate info to string format
        delegate_info_str = json.dumps(delegate_info, indent=4)
        # Use delegate info as prompt to chat with GPT-3
        response = chat_gpt.chat(delegate_info_str)
        # Save the response in the responses dictionary
        responses[delegate_id] = response
        # Save the responses dictionary to a JSON file after each response
        with open('classified_delegates.json', 'w') as f:
            json.dump(responses, f, indent=4)
    except Exception as e:
        print(f"Error processing delegate {delegate_id}: {e}")
        traceback.print_exc()
        continue
