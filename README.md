<p align="center">
  <img alt="StaffScore Logo" src="https://github.com/anjalecnik/StaffScore/assets/108223734/1145b321-b153-4843-ad3f-88f9f53b29db" >
</p> 

# StaffScore 🏆
Welcome to **StaffScore**, a web application designed to help team leaders track and evaluate the performance of their team members effortlessly.
<br/>

## Vision 🌟
The vision for StaffScore is to become the leading tool for team performance evaluation, enabling organizations to foster growth, recognize talent, and make informed decisions based on data-driven insights. The goal is to create a transparent and efficient system that promotes continuous improvement and facilitates constructive feedback within teams.
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
<div style="width: 100%; text-align: center;">
  
| React | TypeScript | Material UI | React-admin | Node.js | Firebase | GoogleAuth | Vercel |
| :---: | :--------: | :----: | :-----: | :------: | :------: | :----: | :----: |
| <a href="https://react.dev/" title="React"><img src="https://github.com/get-icon/geticon/raw/master/icons/react.svg" alt="React" width="50px" height="50px"></a> | <a href="https://www.typescriptlang.org/" title="Typescript"><img src="https://github.com/get-icon/geticon/raw/master/icons/typescript-icon.svg" alt="Typescript" width="50px" height="50px"></a> | <a href="https://mui.com/material-ui/" title="MaterialUI"><img src="https://github.com/get-icon/geticon/blob/master/icons/material-ui.svg" alt="MaterialUI" width="50px" height="50px"></a> | <a href="https://marmelab.com/react-admin/" title="React-admin"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/React_Admin_logo.svg/1200px-React_Admin_logo.svg.png" alt="React-admin" width="50px" height="50px"></a> | <a href="https://nodejs.org/en" title="Node.js"><img src="https://github.com/get-icon/geticon/blob/master/icons/nodejs.svg" alt="Node.js" width="50px" height="50px"></a> |<a href="https://www.firebase.com/" title="Firebase"><img src="https://github.com/get-icon/geticon/raw/master/icons/firebase.svg" alt="Firebase" width="50px" height="50px"></a> | <a href="https://developers.google.com/identity/sign-in/web/sign-in" title="Google Auth"><img src="https://github.com/anjalecnik/StaffScore/assets/108223734/3db99a14-b806-4feb-aa2d-d0ad4f551339" alt="Google Auth" width="70px" height="50px"></a> | <a href="https://vercel.com/" title="Vercel"><img src="https://github.com/get-icon/geticon/blob/master/icons/vercel.svg" alt="Vercel" width="50px" height="50px"></a>


</div>

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
    cd Frontend
    npm install
    npm run dev
   ```
3. Open a new terminal and install Backend Dependencies
    ```bash
    cd Backend
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

## App Previews
Here are some screenshots showcasing different features of the app:
<p >
  <img alt="dashboard" width="800" src="https://github.com/anjalecnik/StaffScore/assets/108223734/21ef12a7-731e-41eb-bd98-e55d0ba8f868">
  <br/>
  Upon entering the application, managers are greeted with evaluation statistics dashboard and have access to a calendar with a countdown to the next quarterly evaluation date.

  <p float="left">
    <img src="https://github.com/anjalecnik/StaffScore/assets/108223734/41cab198-62c1-43f4-9545-890edc33694a" width="400" />
    <img src="https://github.com/anjalecnik/StaffScore/assets/108223734/1f3c7a90-9324-4da4-bea5-55b0405b1faa" width="400" />
    <br/>
    For a quality insight into the data, various graphs are available: a statistical graph of individual user evaluations, showing their performance on specific questionnaires, a hierarchical team graph and a statistical graph of team member evaluations.
  </p>

  <p float="left">
    <img src="https://github.com/anjalecnik/StaffScore/assets/108223734/37a7fe98-9fd4-45fb-95a0-949e266a49a9" height="277" />
    <img src="https://github.com/anjalecnik/StaffScore/assets/108223734/d96a2c97-0c07-4907-b253-7c08b8c5b67a" height="277" />
    <br/>
    It enables full customization of questions on questionnaires, including adjusting their weight. After evaluation, a PDF report is also available.
  </p>

  For additional screenshots of the app, please navigate to the [PROMOTION](https://github.com/anjalecnik/StaffScore/tree/main/_PROMOTION)  folder.
</p>
<br/>

## Additional Features 🌃
The app includes a dark theme for improved user experience in low-light environments.
<br/><br/>

## Known Issues/Problems 🐛
- **Mobile Responsiveness**: Certain UI components need optimization for smaller screens.
- **Dashboard UI**: The dashboard UI is not correctly responsive on large screens (only looks good on laptop size).
- **Filtering**: Filtering tables can only be used after sorting has been selected.
- **Search Functionality**: Case-insensitive search and substring search are not available due to Firebase limitations.
- **Form validation**: The form remains in a dirty state even after values are cleared, causing the submit button to remain enabled due to React Admin's behavior.
<br/>

## Author
[Anja Lečnik](https://si.linkedin.com/in/anja-lecnik)
