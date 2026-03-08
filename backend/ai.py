from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import re

tokenizer = None
model = None

def load_model():

    global tokenizer,model

    if tokenizer is None or model is None:
        tokenizer = AutoTokenizer.from_pretrained("flax-community/t5-recipe-generation")
        model = AutoModelForSeq2SeqLM.from_pretrained("flax-community/t5-recipe-generation")

    return tokenizer,model

load_model()

def generate_recipe(ingredients: str) -> dict:
    input_text = f"items: {ingredients}"
    # Токенезатор делает из слов числа которые понмает модель
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True, max_length=256)
    
    
    with torch.no_grad(): 
        outputs = model.generate(
            inputs.input_ids,
            max_length=512,
            num_beams=5,
            early_stopping=True,
            no_repeat_ngram_size=3
        )
    
    # возвращаем числа в текст 
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
 
    title = ""
    ingredients_text = ""
    directions_text = ""

    # возможно нужно доработать 
    title_match = re.search(r"title:\s*(.*?)(?:\n|ingredients:|directions:|instructions:|$)", generated_text, re.IGNORECASE | re.DOTALL)
    if title_match:
        title = title_match.group(1).strip()
    else:
        first_line = generated_text.split('\n')[0].strip()
        if first_line and len(first_line) < 100:
            title = first_line
        else:
            title = "Нет названия рецепта"

    ingredients_match = re.search(r"ingredients:\s*(.*?)(?:\n|directions:|instructions:|$)", generated_text, re.IGNORECASE | re.DOTALL)
    if ingredients_match:
        ingredients_text = ingredients_match.group(1).strip()
        ingredients_text = re.sub(r'\s*--\s*', ', ', ingredients_text)
    else:
        ingredients_text = ingredients + ", специи по вкусу"

    directions_match = re.search(r"(?:directions|instructions):\s*(.*?)(?:\n|$)", generated_text, re.IGNORECASE | re.DOTALL)
    if directions_match:
        directions_text = directions_match.group(1).strip()
        directions_text = re.sub(r'\s*--\s*', ', ', directions_text)
    else:
        directions_text = "Инструкция отсутствует"

    return {
        "title": title,
        "ingredients": ingredients_text,
        "instructions": directions_text,
        "cooking_time": 0
    }