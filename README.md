🍔 ZippieEats – Route-Based Restaurant Discovery Platform

ZippieEats is a web application that helps users discover restaurants dynamically using an interactive map interface. Instead of manually searching for restaurants, users can explore restaurants directly from the map based on the visible area.

The application integrates OpenStreetMap and Leaflet.js to fetch restaurants and display them on a map along with a scrollable list of restaurant names.

This project demonstrates how mapping technologies can be used to build location-aware applications for food discovery.

🌐 Live Website
You can access the deployed application here:

🔗 Live Demo:
[https://your-render-link.onrender.com](https://zippyeats-4so6.onrender.com/)
🚀 Features
🗺️ Interactive Map

Built using Leaflet.js and OpenStreetMap
Allows users to explore restaurants visually on a map.

📍 Dynamic Restaurant Discovery

Restaurants are dynamically fetched based on the visible map region.
Data is retrieved from OpenStreetMap (OSM).

🍽️ Restaurant Markers

Restaurants appear as markers on the map.
Each marker represents a restaurant discovered from the map data.

📋 Restaurant List Panel

A left-side scrollable panel displays restaurant names fetched from the map.
Users can easily view all discovered restaurants in one place.

🔐 User Authentication

Backend authentication system implemented.
Users can register and login.

🗄️ Database Integration

PostgreSQL database used to store user information.
Backend APIs interact with the database.

🏗️ Tech Stack
Frontend

HTML
CSS
JavaScript
React
Leaflet.js
OpenStreetMap

Backend

Node.js
Express.js
Database
PostgreSQL

Tools & Platforms

Git & GitHub
VS Code
Render (deployment)


📂 Project Structure
ZippieEats
│
├── frontend
│   ├── components
│   ├── pages
│   ├── RouteRestaurants.jsx
│   └── Map integration files
│
├── backend
│   ├── controllers
│   ├── routes
│   │   └── auth.routes.js
│   ├── config
│   └── server.js
│
└── README.md

⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/yourusername/zippieeats.git
cd zippieeats
2️⃣ Backend Setup
Navigate to backend folder:

cd backend
npm install

Create a .env file inside the backend folder.

Example:
DATABASE_URL=your_postgresql_connection_string
PORT=5000

Start the backend server:
npm start
3️⃣ Frontend Setup

Navigate to frontend folder:

cd frontend
npm install
npm run dev

📸 Application Workflow

User opens the application.
The interactive map loads using Leaflet.js.
Restaurants are fetched dynamically from OpenStreetMap data.
Restaurants appear as markers on the map.
The left-side panel displays a list of restaurants discovered from the map.

🚧 Upcoming Features

Future improvements planned for ZippieEats:
🍽️ Restaurant details page
📜 Restaurant menu display
⭐ Ratings and reviews
🧭 Route-based restaurant filtering for travelers
📱 Mobile responsive UI
🤖 Smart restaurant recommendations
