import json

# Load the JSON files
with open('delegates_follows.json') as f:
    delegate_follows = json.load(f)

with open('delegates_profile.json') as f:
    delegates_profile = json.load(f)

with open('delegates_votes.json') as f:
    delegates_votes = json.load(f)

# Create an empty dictionary to store all the data
data = {}

# Add the delegate follows data to the dictionary
for item in delegate_follows:
    delegate_id = item['delegate']['id']
    if delegate_id not in data:
        data[delegate_id] = {}
    data[delegate_id]['follows'] = item['follows']

# Add the delegates profile data to the dictionary
for item in delegates_profile:
    delegate_id = item['delegate']['id']
    if delegate_id not in data:
        data[delegate_id] = {}
    data[delegate_id]['profile'] = item['profile']

# Add the delegates votes data to the dictionary
for item in delegates_votes:
    delegate_id = item['delegate']['id']
    if delegate_id not in data:
        data[delegate_id] = {}
    data[delegate_id]['votes'] = item['votes']

# Save the dictionary to a JSON file
with open('output.json', 'w') as f:
    json.dump(data, f)


# Load the JSON file
with open('aggragated_delegate_data.json') as f:
    data = json.load(f)


def print_delegate_info(delegate_id, data):
    if delegate_id in data:
        delegate_info = data[delegate_id]
        print(f"Information for delegate {delegate_id}:")
        print(delegate_info)
        print("----------------------------")
        for key, value in delegate_info.items():
            print(f"\n{key.capitalize()}:")
            if isinstance(value, list):
                if isinstance(value[0], dict):
                    for i, item in enumerate(value, 1):
                        print(f"\nItem {i}:")
                        for subkey, subvalue in item.items():
                            print(f"  {subkey}: {subvalue}")
                else:
                    for i, item in enumerate(value, 1):
                        print(f"  {i}: {item}")
            elif isinstance(value, dict):
                for subkey, subvalue in value.items():
                    print(f"  {subkey}: {subvalue}")
            else:
                print(value)
    else:
        print(f"No information available for delegate {delegate_id}")

def print_delegate_ids(data):
    for i, delegate_id in enumerate(data.keys(), 1):
        print(f"{i}. {delegate_id}")


print_delegate_ids(data)

# Print delegate information
# print_delegate_info("0xBEC643BD5b7F5e9190617CA4187ef0455950C51C", data)