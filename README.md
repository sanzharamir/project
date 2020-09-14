# NaturalWonders
NaturalWonders is a full-stack web application where users can post and review nature attractions. 
This project was a part of Colt Steele's "The Web Developer Bootcamp" course on Udemy.

# Motivation
The purpose of the application is to help users find and share nature attractions all around the world. 
The app aims to promote ecotourism and conservation of natural wonders. It also promotes healthy lifestyle by encouraging people to go camping, hiking, etc.  

# Demo
For live demo, visit https://naturalwonders.herokuapp.com/

# Tech/framework used
- **HTML5** - markup language for creating web pages and web applications
- **CSS3** - is a stylesheet language used to describe the presentation of a document written in markup language
- **Bootstrap** - free and open-source front-end web framework for designing web applications quickly
- **jQuery** - cross-platform JavaScript library designed to simplify the client-side scripting of HTML
- **DOM Manipulation** - is a platform and language-neutral interface that allows programs and scripts to dynamically access and update the content, structure, and style of a document
- **Node.js** - open-source, cross-platform JavaScript run-time environment that executes JavaScript code server-side
- **Express.js** - minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications
- **REST** - REST (REpresentational State Transfer) is an architectural style for developing web services
- **MongoDB** - open-source cross-platform document-oriented NoSQL database program 
- **PassportJS** - authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application
- **Data Associations** - associating user data with the respective places and comments using reference method
- **Heroku** - cloud platform as a service used as a web application deployment model
- **Google Cloud Platfrom** -  is a suite of cloud computing services that runs on the same infrastructure that Google uses internally for its end-user products

# Features

- Authentication:
  - User login and sigh up with username and password

- Authorization:
  - The user have to be logged in to post attractions, reviews, or comments
  - The user can only edit/delete posts, reviews, and comments they added

- Manage posts with basic functionalities:
  - Create, edit and delete posts, reviews, and comments
  - Display attraction's location on Google Maps
  
- Flash messages responding to users' interaction with the app
- Responsive web design
- All the data will pe persistent and is stored in the Amazon cloud

# To Do:
  - [x] Integrate Google Maps
  - [ ] User profiles
  - [ ] Search for existing attractions
  - [ ] Sort attractions by name, rating
