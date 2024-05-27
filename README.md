
# StaffScore 🏆

Welcome to **StaffScore**, a web application designed to help team leaders track and evaluate the performance of their team members effortlessly.

<br/>


## Key Features ✨
<!--- - spacing -->
  ### Core Functionalities    
  1. **User Management (CRUD)**
      - Create, read, update, and delete users.
      - Add basic information and relevant tags for categorization.
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

### Users 👥
 - Executive
    - Access to all teams.
    - Create teams, add members, assign team leaders, and add tags from a predefined list.
  - Team Lead
    - Sees only their assigned team.
    - Provides evaluations for team members.
  - User (Employee)
    - Can view their own evaluations and comments.
   
### Evaluation Process 📝
  - Conducted 4 times a year (every 3 months).
  - Includes yes/no questions, 1-10 ratings, and a section for comments.
  - Dynamic questionnaire generation with weighted questions.
  - Example questions: "Would you recommend this person for the next project?", "Would you recommend this person for a promotion?"
  - Average scores calculated from completed questionnaires.
  - Team members can comment on their evaluations.

### Tags 🏷️
  - 7 basic tags: QA, Android, iOS, FE, BE, UX, etc.
  - Executives can add new tags.

### Tech Stack 🛠️
  - Frontend: [React](https://react.dev/) (Vite TS starter), [React Admin](https://marmelab.com/react-admin/), [Material UI](https://mui.com/) 
  - Backend: Node.js (Express).
  - Database: [Firebase](https://firebase.google.com/) (Firestore, Google auth for login)

### Deployment 🚀
  - The app is deployed on Vercel. Check it out [here](https://staff-score-frontend.vercel.app/).
  - To run the frontend locally, install modules with *npm install* and start the development server with *npm run dev*. The same commands apply for the backend.

-----

Thank you for using StaffScore! We hope it makes managing your team a breeze! 😊
