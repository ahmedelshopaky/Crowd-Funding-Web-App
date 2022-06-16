# Crowd-Funding-Web-App
## Using Django and React.js

Crowdfunding is the practice of funding a project or venture by raising small amounts of money from a large number of people, typically via the Internet. Crowdfunding is a form of crowdsourcing and alternative finance. In 2015, over US$34 billion was raised worldwide by crowdfunding (<a href="https://en.wikipedia.org/wiki/Crowdfunding">Wikipedia</a>).

<b>The aim of the project:</b> Create a web platform for starting fundraise projects in Egypt.


### The web app includes the following features:
   1. Authentication System:
      - Registration.
      - Activation Email after registration.
      - Login.
      - User Profile.
   2. The user can create a project fund raise campaign and he can do CRUD operations according to roles and permissions.
      - Users can view any project and donate to the total target.
      - Users can add comments on the projects.
      - Users can rate the projects.
   3. Homepage contains the following:
      - A slider to show the highest five rated running projects to encourage users to donate.
      - List of the latest 5 projects.
      - List of latest 5 featured projects (which are selected by the admin).
      - A list of the categories. User can open each category to view its projects.
      - Search bar that enables users to search projects by title or tag.

<hr/>


### Installation and Running the App
01. ```git clone https://github.com/ahmedelshopaky/Crowd-Funding-Web-App```
#### Backend
02. ```cd backend/```
03. ```python3 -m venv .venv```
04. ```source .venv/bin/activate```
05. ```python3 -m pip install django```
06. ```pip install -r requirements.txt```
07. ```python3 manage.py runserver```

#### Frontend
08. ```cd ../frontend/```
09. ```npm install```
10. ```npm start```

<hr/>

### Before running the app

- go to backend/crowdfunding/settings.py to change database configurations to suit your local database
