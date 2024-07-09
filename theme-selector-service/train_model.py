import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Charger les données
data = pd.read_csv('data/profession_themes.csv')

# Mappage des professions aux thèmes
profession_to_theme = {
    'Accountants and Auditors': 'finance',
    'Actors': 'entertainment',
    'Actuaries': 'finance',
    'Acupuncturists': 'healthcare',
    'Acute Care Nurses': 'healthcare',
    'Software Developer': 'technology',
    'Web Developer': 'technology',
    'Data Scientist': 'technology',
    'Graphic Designer': 'arts',
    'Marketing Manager': 'marketing',
    'Mechanical Engineer': 'engineering',
    'Agricultural Engineer': 'agriculture',
    'Air Traffic Controller': 'aviation',
    'Artist': 'arts',
    'Automotive Technician': 'mechanics',
    'Baker': 'food',
    'Bartender': 'hospitality',
    'Biologist': 'science',
    'Bus Driver': 'transportation',
    'Business Analyst': 'business',
    'Chef': 'food',
    'Civil Engineer': 'engineering',
    'Construction Worker': 'construction',
    'Customer Service Representative': 'customer service',
    'Delivery Driver': 'delivery',
    'Doctor': 'healthcare',
    'Elementary School Teacher': 'education',
    'Farmer': 'agriculture',
    'Firefighter': 'public safety',
    'Journalist': 'media',
    'Lawyer': 'legal',
    'Librarian': 'library',
    'Marketing Specialist': 'marketing',
    'Nurse': 'healthcare',
    'Personal Trainer': 'personal care',
    'Photographer': 'arts',
    'Pilot': 'aviation',
    'Police Officer': 'law enforcement',
    'Real Estate Agent': 'business',
    'Restaurant Manager': 'hospitality',
    'Sales Manager': 'management',
    'Social Worker': 'social services',
    'Software Engineer': 'technology',
    'Sports Coach': 'sports',
    'Veterinarian': 'healthcare',
    'Waiter': 'hospitality',
    'Welder': 'manufacturing',
    'Writer': 'media',
    'No Profession': 'no_theme'
}

# Ajouter une nouvelle colonne pour les thèmes basés sur le mappage
data['theme'] = data['Occupation'].map(profession_to_theme)

# Supprimer les lignes avec des thèmes NaN (s'il y en a)
data = data.dropna(subset=['theme'])

# Séparer les caractéristiques (X) et la cible (y)
X = data['Occupation']
y = data['theme']

# Convertir les professions en variables indicatrices (one-hot encoding)
X = pd.get_dummies(X)

# Diviser les données en ensembles d'entraînement et de test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialiser et entraîner le modèle de forêt aléatoire
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Sauvegarder le modèle entraîné dans un fichier
joblib.dump(model, 'model/theme_selector_model.pkl')

# Sauvegarder le dictionnaire de mappage dans un fichier CSV pour référence future
mapping_df = pd.DataFrame(list(profession_to_theme.items()), columns=['Profession', 'Theme'])
mapping_df.to_csv('data/profession_to_theme_mapping.csv', index=False)
