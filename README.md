# Basic Todo App 

## 🛠 Tech Stack
| Category | Technologies |
| :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) 
| **Backend** | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) |
| **Testing** | ![Jest](https://img.shields.io/badge/-Jest-C21325?logo=jest&logoColor=white) ![Testing Library](https://img.shields.io/badge/-Testing_Library-E33332?logo=testing-library&logoColor=white) |
| **Tooling** | ![npm](https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white) ![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white) |

## ⚙️ How to use it

Follow these steps to set up and run the application locally.

### 1. MongoDB Atlas Setup

Before running the application, you need to set up a cloud database.

1.  **Create an Account:** Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2.  **Create a Cluster:** Deploy a free shared cluster.
3.  **Create Database & Collection:**
    * Go to the **Browse Collections** tab.
    * Create a new database named **`todoList`**.
    * Create a collection named **`todos`**.
4.  **Get Connection String:**
    * Go to **Database Access** to create a database user (username/password).
    * Go to **Network Access** and allow access from anywhere (`0.0.0.0/0`) or your specific IP.
    * Click **Connect** > **Connect your application** and copy the connection string (e.g., `mongodb+srv://...`).

### 2. Installation & Configuration

Clone the repository and install dependencies for both the frontend and backend.

```bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/todo-app.git](https://github.com/YOUR_USERNAME/todo-app.git)
cd todo-app

# 2. Install Backend Dependencies
cd todo-api
npm install

# 3. Configure Environment Variables
# Create a .env file in the 'todo-api' directory and paste your connection string
echo "MONGO_URI=your_mongodb_connection_string_here" > .env
echo "PORT=3001" >> .env

# 4. Install Frontend Dependencies
cd ../frontend
npm install
```
3. Running the Application
Once the installation is complete, you can start the application.

Navigate to the root directory (or set up a concurrent script) and run:

```bash

# If you have a root script set up with 'concurrently':
npm run dev
# Alternatively, you can run them in separate terminals:

cd todo-api && npm start (Runs on port 3001)

cd frontend && npm start (Runs on port 3000)
```
# 📝 Technical Decisions

This section details the architectural choices, testing strategy, and key takeaways from the 3-day development cycle

### 🎯 Project Goal & Strategy

The primary goal of this project was to simulate a real-world **Front-End Coding Challenge** often used by international tech companies. 

Our workflow was: **Frontend $\rightarrow$ Backend (Initial) $\rightarrow$ Refactoring $\rightarrow$ Test Design $\rightarrow$ Frontend Testing.**

### 💡 Architectural Evolution & Frontend Refactoring

Our frontend architecture evolved to comply with current best practices:

* **Initial Structure:** The application began with a centralized state (`Home` component) handling all **CRUD** methods and passing them down as props to children (`List` and `Form`).
* **Refactoring to Custom Hooks** As asynchronous operations (API calls) were introduced, the logic became complex. We extracted all state management and asynchronous methods into a dedicated custom hook (`useTodos`).
    * **Benefit:** This achieves a **Separation of Concerns**, making the UI components purely presentational and significantly improving testability and code readability.
* **Performance:** Implemented `useCallback` on memoized functions within the custom hook to prevent the unnecessary re-creation of functions, optimizing rendering performance when passed as dependencies or props.
* **UX & Error Handling:** Fixed critical issues regarding the user experience:
    * **Loading State:** Implemented a visible `Loading...` state during API calls to improve user feedback during asynchronous operations.
    * **Error Delegation:** Ensured API errors were properly caught and delegated to the UI for user display and logging.
    * **Type Safety:** Implemented stringent data **Type Validation** across the frontend-backend boundary to prevent runtime errors.

---

### 🌐 Backend Decisions

* **Technology Choice:** We chose **Express.js** and **MongoDB** over modern, simplified solutions like Supabase or Next.js API Routes.
* **Rationale:** The hypothesis (supported by AI consultation) was that coding challenges would deliberately require candidates to demonstrate foundational knowledge by setting up a traditional **RESTful API** and managing a database connection manually, rather than relying on simplified frameworks.

---

### 🧪 Testing Strategy: UML State transition diagram

Our strategy focused on building confidence with robust **Integration Tests**, aligning with the **Testing Trophy** philosophy.


#### 1. Test Case Design (Design-First)
Test cases were extracted using a **State Transition Diagram (UML)** modeled in **Mermaid**. This process was crucial:
<img width="300" height="400" alt="Untitled diagram-2025-11-22-090226" src="https://github.com/user-attachments/assets/13e164bd-6f71-49f4-8e49-8cbdf4b4ef53" />
* **Clarity:** It clearly defined valid states and actions, simplifying the subsequent test implementation.
* **Edge Case Detection:** Formal state modeling helped anticipate specific edge cases (e.g., what happens when clicking 'Complete' while in the 'Editing' state).

#### 2. Test Case Segmentation (The Two Core Scenarios)
The tests were separated into two logical groups:

| Scenario | Focus | Rationale |
| :--- | :--- | :--- |
| **App Level** | Empty List $\leftrightarrow$ Populated List | Verifies the core conditional rendering (e.g., "There is no todo" message appears/disappears) during boundary transitions (0 $\leftrightarrow$ 1+ todos). |
| **Item Level** | Individual Todo State | Focuses on the lifecycle of a single item (Idle, Editing, Completed) and ensuring **list stability** (checking that completing one item does not destabilize the others). |

This segmentation prevents the test code from becoming redundant and simplifies future additions like **Pagination** or **Filtering**.

---

### ⏭️ Future Commitments

* **Backend Testing:** Implementing unit and integration tests for the Express API handlers and MongoDB logic.
* **E2E Testing:** Introduction of an End-to-End framework (e.g., Playwright) to validate critical user flows across a real browser environment.
