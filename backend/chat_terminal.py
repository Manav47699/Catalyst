from llama_cpp import Llama

# Use absolute path to avoid relative path issues
MODEL_PATH = "/home/manav/Projects/taranga-1.0-software-hackathon__Fully_Stacked/models/llama-3.2-3b-instruct.Q8_0.gguf"

# Load the model
llm = Llama(model_path=MODEL_PATH)

print("Model loaded! Type your messages (type 'exit' to quit).")

while True:
    prompt = input("You: ")
    if prompt.lower() == "exit":
        break

    output = llm(prompt, max_tokens=200)  # adjust max_tokens as needed
    print("AI:", output["choices"][0]["text"])
