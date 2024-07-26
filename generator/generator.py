from pymongo import MongoClient
from faker import Faker
import random
import requests
from PIL import Image
from io import BytesIO
import base64
from dotenv import load_dotenv
import os

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Connexion à MongoDB
mongo_uri = 'mongodb://admin:DALt5z7kaxBKqX1V4O6I@node1-ca7500ced7cd4521.database.cloud.ovh.net,node2-ca7500ced7cd4521.database.cloud.ovh.net,node3-ca7500ced7cd4521.database.cloud.ovh.net/admin?replicaSet=replicaset&tls=true'
client = MongoClient(mongo_uri)
db = client['admin']  # Using the 'admin' database
collection = db['users']  # Using the 'users' collection

# Initialisation de Faker pour différentes cultures
fake_fr = Faker('fr_FR')
fake_ar = Faker('ar_AA')
fake_en = Faker('en_US')

# Obtenir l'URL du serveur d'images depuis les variables d'environnement
IMAGE_SERVER_URL = os.getenv('IMAGE_SERVER_URL')

# Fonction pour obtenir une image
def get_image(user_id):
    response = requests.get('https://randomuser.me/api/')
    if response.status_code == 200:
        data = response.json()
        url = data['results'][0]['picture']['large']
        return save_image(url, user_id)
    return ""

# Fonction pour sauvegarder les images localement et les envoyer au serveur d'images
def save_image(url, user_id):
    response = requests.get(url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content))
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

        # Envoi de l'image au serveur d'images
        image_name = f"{user_id}_image.jpg"
        data = {
            "user_id": user_id,
            "nom": image_name,
            "base64": image_base64
        }

        #print("Sending image data:", data)  # Log the data being sent

        try:
            image_response = requests.post(f"{IMAGE_SERVER_URL}/ajouter-image", json=data)
            if image_response.status_code == 200 and 'link' in image_response.json():
                image_link = image_response.json()['link'].replace("localhost", "135.125.244.65")
                print(f"Image uploaded successfully: {image_link}")
                return image_link
            else:
                print(f"Error uploading image: {image_response.text}")
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
    return ""

# Fonction pour générer des profils avec des noms et prénoms de différentes cultures
def generate_profiles(n):
    profiles = []
    for _ in range(n):
        locale = random.choice(['fr', 'ar', 'en'])
        if locale == 'fr':
            fake = fake_fr
        elif locale == 'ar':
            fake = fake_ar
        else:
            fake = fake_en

        user_id = fake.uuid4()
        image_url = get_image(user_id)
        email = fake.email()
        email = email.split('@')[0] + '@gmail.com'  # Replace domain with gmail.com

        profile = {
            'firstName': fake.first_name(),
            'lastName': fake.last_name(),
            'email': email,
            'password': fake.password(length=10),
            'userType': random.choice(["employer", "recruiter", "jobSeeker"]),
            'phone': fake.phone_number(),
            'dateOfBirth': fake.date_of_birth().strftime("%Y-%m-%d"),
            'age': random.randint(18, 80),  # Ajustement de l'âge
            'showAge': random.choice([True, False]),
            'address': {
                'street': fake.street_address(),
                'city': fake.city(),
                'state': fake.state() if hasattr(fake, 'state') else fake.city(),
                'zipCode': fake.postcode(),  # Utilisation de postcode() au lieu de zipcode()
                'country': fake.country()
            },
            'profession': fake.job(),
            'bio': fake.text(),
            'experience': [fake.sentence() for _ in range(random.randint(1, 5))],
            'education': [fake.sentence() for _ in range(random.randint(1, 3))],
            'skills': [fake.word() for _ in range(random.randint(1, 10))],
            'hobbies': [fake.word() for _ in range(random.randint(1, 5))],
            'images': [image_url] if image_url else [],
            'videos': [],
            'verificationCode': fake.md5(),
            'verificationCodeExpiresAt': fake.date_time_this_year(),
            'isVerified': random.choice([True, False]),
            'resetPasswordCode': fake.md5(),
            'resetPasswordExpiresAt': fake.date_time_this_year(),
            'sex': random.choice(['male', 'female', 'other']),
            'company': fake.company(),
            'companyId': fake.uuid4(),
            'companies': [],
            'socialMediaLinks': {
                'github': fake.url(),
                'twitter': fake.url(),
                'instagram': fake.url(),
                'facebook': fake.url(),
                'discord': fake.url()
            },
            'locale': locale
        }
        print(f"Generated profile for {profile['firstName']} {profile['lastName']} with email {profile['email']}")
        profiles.append(profile)
    return profiles

# Générer et insérer des profils dans MongoDB
profiles = generate_profiles(100)
if profiles:
    collection.insert_many(profiles)
    print("Profiles insérés avec succès !")
else:
    print("Aucun profil n'a été généré.")

client.close()
