from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import logging
import pandas as pd
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
mongo = PyMongo(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Charger le mappage des professions
mapping_df = pd.read_csv('data/profession_to_theme_mapping.csv')
profession_to_theme = dict(zip(mapping_df['Profession'], mapping_df['Theme']))

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

@app.route('/predict_theme', methods=['POST'])
def predict_theme():
    data = request.get_json()
    profession = data.get('profession', 'No Profession')

    if profession in profession_to_theme:
        theme = profession_to_theme[profession]
    else:
        theme = profession_to_theme['No Profession']

    return jsonify({'theme': theme})

@app.route('/toggle_theme', methods=['POST'])
def toggle_theme():
    data = request.get_json()
    user_id = data.get('userId', 'dummy_user_id')
    profession = data.get('profession', 'No Profession')

    users_collection = mongo.db.users
    user_theme = users_collection.find_one({'userId': user_id})

    if not user_theme:
        return jsonify({'error': 'User not found'}), 404

    current_theme_enabled = user_theme.get('theme_enabled', True)
    new_theme_enabled = not current_theme_enabled

    users_collection.update_one(
        {'userId': user_id},
        {'$set': {
            'theme_enabled': new_theme_enabled,
            'profession': profession  # Mettre à jour la profession de l'utilisateur
        }}
    )

    theme = profession_to_theme.get(profession, 'no_theme')

    logging.info(f'Theme toggled: {"Enabled" if new_theme_enabled else "Disabled"}')
    logging.info(f'Theme status for user {user_id}: {"Enabled" if new_theme_enabled else "Disabled"}, Theme: {theme}, Profession: {profession}')

    return jsonify({'theme_enabled': new_theme_enabled, 'theme': theme})

@app.route('/theme_status', methods=['POST'])
def get_theme_status():
    data = request.get_json()
    user_id = data.get('userId', 'dummy_user_id')
    profession = data.get('profession', 'No Profession')

    logging.info(f'Received request for theme status with userId: {user_id} and profession: {profession}')

    users_collection = mongo.db.users
    user_theme = users_collection.find_one({'userId': user_id})

    if not user_theme:
        logging.info(f'User with userId: {user_id} not found, creating user with default values')
        default_profession = profession
        default_theme = profession_to_theme.get(default_profession, 'no_theme')
        user_theme = {
            'userId': user_id,
            'theme_enabled': False,
            'profession': default_profession
        }
        users_collection.insert_one(user_theme)
    else:
        theme_enabled = user_theme.get('theme_enabled', True)
        profession = user_theme.get('profession', profession)
        theme = profession_to_theme.get(profession, 'no_theme')
        logging.info(f'Theme status for user {user_id}: {"Enabled" if theme_enabled else "Disabled"}, Theme: {theme}, Profession: {profession}')
        return jsonify({'theme_enabled': theme_enabled, 'theme': theme, 'profession': profession})

    return jsonify({'theme_enabled': user_theme['theme_enabled'], 'theme': default_theme, 'profession': user_theme['profession']})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)
