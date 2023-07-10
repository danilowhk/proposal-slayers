import openai

class ChatGPT:
    def __init__(self, api_key, filepath):
        self.api_key = api_key
        self.short_term_memory = []
        self.system_prompt = self.open_file(filepath)
        openai.api_key = self.api_key

    def open_file(self, filepath):
        with open(filepath, 'r', encoding='utf-8') as infile:
            return infile.read()

    def save_file(self, filepath, content):
        with open(filepath, 'a', encoding='utf-8') as outfile:
            outfile.write(content)

    def chat(self, user_input, temperature=1, frequency_penalty=0.2, presence_penalty=0, max_turns=10):
        self.short_term_memory.append({"role": "user","content": user_input})

        # Only use the last max_turns turns of the short_term_memory
        if len(self.short_term_memory) > max_turns * 2:
            self.short_term_memory = self.short_term_memory[-max_turns * 2:]

        # Building the input prompt
        messages_input = self.short_term_memory.copy()
        prompt = [{"role": "system", "content": self.system_prompt}]
        messages_input.insert(0, prompt[0])
        #TODO: Add remaining functions / actions
        #TODO: Compose "enums" with possible options for each function based on observations
        functions=[
            {
                "name": "classify_delegate",
                "description": "Given the delegate's information, classify the delegate's Level of Experience, Specialization, Proposal History, Activity Level",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "delegate_info": {
                            "type": "string",
                            "description": "Information about the delegate to be classified",
                        },
                        "level_of_experience": {
                            "type": "string",
                            "description": "Classify the level of experience of the delegate based on their involvement in blockchain and DAOs, and significant roles in other DAOs",
                        },
                        "specialization": {
                            "type": "string",
                            "description": "Identify the delegate's area of expertise, which could be anything from smart contract development, legal expertise, finance, governance, marketing, etc.",
                        },
                        "proposal_history": {
                            "type": "string",
                            "description": "Evaluate the kinds of proposals the delegate has supported in the past",
                        },
                        "activity_level": {
                            "type": "string",
                            "description": "Measure how active the delegate is in community discussions and DAO governance",
                        }
                    },
                    "required": ["delegate_info", "level_of_experience", "specialization", "proposal_history", "activity_level"]
                }
            }
        ]

        completion = openai.ChatCompletion.create(
            model="gpt-4-0613",
            temperature=temperature,
            frequency_penalty=frequency_penalty,
            presence_penalty=presence_penalty,
            messages=messages_input,
            functions=functions,
            function_call="auto"
        )

        chat_response = completion['choices'][0]['message']

        print("CHAT RESPONSE1 :", chat_response)

        function_info = {}  
        response = ""  # Initialize response to an empty string

        if 'function_call' in completion.choices[0].message:
            function_info = completion.choices[0].message['function_call']
            response = function_info
            print("FUNCTION INFO :", function_info)
        
        self.short_term_memory.append({"role": "assistant", "content": str(response)})

        print("RESPONSE :", response)

        return response