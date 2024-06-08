<p align="center">
  <img alt="StaffScore Logo" src="https://github.com/anjalecnik/StaffScore/assets/108223734/1145b321-b153-4843-ad3f-88f9f53b29db" >
</p>

# StaffScore 🏆
Welcome to **StaffScore**, a web application designed to help team leaders track and evaluate the performance of their team members effortlessly.
<br/>

## Vision 🌟
Our vision for StaffScore is to become the leading tool for team performance evaluation, enabling organizations to foster growth, recognize talent, and make informed decisions based on data-driven insights. We aim to create a transparent and efficient system that promotes continuous improvement and facilitates constructive feedback within teams.
<br/>

## Competitors 🏅
- **15Five**
  - *Comprehensive employee engagement platform with various feedback mechanisms.*
  - <ins>Cons:</ins> More expensive, may offer features not needed by smaller teams.
- **Lattice**
  - *Advanced performance management and OKR tracking.*
  - <ins>Cons:</ins> Complex setup and higher cost.
- **TINYpulse**
  - *Focus on real-time feedback and employee engagement.*
  - <ins>Cons:</ins> Limited in-depth performance review features.

### <ins>**Why StaffScore is Better**</ins>

- **User-Friendly**: Intuitive design and easy navigation make it accessible for all users.
- **Cost-Effective**: Offers essential features at a competitive price point – it's completely free.
- **Customization**: Dynamic questionnaire generation and tagging system allow for tailored evaluations.
- **Integration**: Seamless connection with existing systems like Firebase for authentication and data management.
<br/>

## Key Features ✨
<!--- - spacing -->
  ### Core Functionalities    
  1. **User Management (CRUD)**
      - Create, read, update, and delete users.
      - Add basic information and relevant tags for categorization (tags can be colored).
      - When a new user is added, they receive an invitation email.
  2. **Team Management (CRUD)**
      - Create, read, update, and delete teams.
      - Add team name, description, members, and designate a team lead.
  3. **Performance Evaluation**
      - Evaluate team members using a predefined questionnaire.
      - Dynamic generation of questionnaires.
      - Provide valuable insights into team members' contributions.
  4. **Evaluation Reports**
      - View detailed evaluation reports.
      - Team leaders evaluate members, executives have an overview of all evaluations.
  5. **Chart Presentations**
      - Intuitive charts showing evaluation statistics over time.
      - Track progress and make informed decisions.
   
### Evaluation Process 📝
  - Conducted 4 times a year (every 3 months).
  - Includes yes/no questions, 1-10 ratings, and a section for comments.
  - Dynamic questionnaire generation with weighted questions.
  - Example questions: "Would you recommend this person for the next project?", "Would you recommend this person for a promotion?"
  - Average scores calculated from completed questionnaires.

### Tags 🏷️
  - 7 basic tags: QA, Android, iOS, FE, BE, UX, etc.
  - Executives can add new tags.

### Tech Stack 🛠️
  - Frontend: [React](https://react.dev/) (Vite TS starter), [React Admin](https://marmelab.com/react-admin/), [Material UI](https://mui.com/) 
  - Backend: Node.js (Express).
  - Database: [Firebase](https://firebase.google.com/) (Firestore, Google auth for login)

### Deployment 🚀
  - The app is deployed on Vercel. Check it out [here](https://staff-score-frontend.vercel.app/).
<br/>

## Systems Integration 🔗
StaffScore connects with:
- Firebase: For authentication and real-time database management.
- Google Authentication: To simplify user login and management.
<br/>

## Step-by-Step Cloning Guide 🛠️
1. Clone repository
   ```bash
   git clone https://github.com/anjalecnik/StaffScore.git
   cd StaffScore
   ```
2. Install Frontend Dependencies
    ```bash
    cd frontend
    npm install
    npm run dev
   ```
3. Install Backend Dependencies
    ```bash
    cd ../backend
    npm install
    npm run dev
   ```
4. Add .env file for Backend
   - There is an example file named **`.env.example`** in the backend directory that includes the necessary configuration.
   - Create a **`.env`** file in the backend directory.
   - Add the following configuration for sending emails:
     ```bash
     MAIL_HOST="gmail"
     MAIL_USERNAME="<EmailID>"
     MAIL_PASSWORD="<Generated Password without Spaces>"
     ```
5. Set Up Firebase (optional)
   - Create a Firebase project.
   - Set up Firestore and Google authentication.
   - Update your Firebase config in the frontend and backend.
<br/>

## Known Issues/Problems 🐛
- **Mobile Responsiveness**: Certain UI components need optimization for smaller screens.
- **Dashboard UI**: The dashboard UI is not correctly responsive on large screens (only looks good on laptop size).
- **Filtering**: Filtering tables can only be used after sorting has been selected.
- **Search Functionality**: Case-insensitive search and substring search are not available due to Firebase limitations.
- **Form validation**: The form remains in a dirty state even after values are cleared, causing the submit button to remain enabled due to React Admin's behavior.
-----
<br/>
Thank you for using StaffScore! We hope it makes managing your team a breeze! 😊
