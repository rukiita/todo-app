### 📝 Project Deep Dive: Technical Decisions & Learnings

This section details the architectural choices, testing strategy, and key takeaways from the 3-day development cycle, designed to meet the standards of modern engineering practices.

#### 🎯 Project Goal & Strategy

The primary goal of this project was to simulate a real-world **Front-End Coding Challenge** often used by international tech companies. The process prioritized **testability, clean architecture, and error handling** over speed.

Our workflow was: **Frontend $\rightarrow$ Backend (Initial) $\rightarrow$ Refactoring $\rightarrow$ Test Design $\rightarrow$ Frontend Testing.**

---

### 💡 Architectural Evolution & Frontend Refactoring

Our frontend architecture evolved to comply with current best practices:

* **Initial Structure:** The application began with a centralized state (`Home` component) handling all **CRUD** methods and passing them down as props to children (`List` and `Form`).
* **Refactoring to Custom Hooks (Best Practice):** As asynchronous operations (API calls) were introduced, the logic became complex. We extracted all state management and asynchronous methods into a dedicated custom hook (`useTodos`).
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

### 🧪 Testing Strategy: The FSM Approach

Our strategy focused on building confidence with robust **Integration Tests**, aligning with the **Testing Trophy** philosophy.

<img width="300" height="400" alt="Untitled diagram-2025-11-22-090226" src="https://github.com/user-attachments/assets/13e164bd-6f71-49f4-8e49-8cbdf4b4ef53" />

#### 1. Test Case Design (Design-First)
Test cases were extracted using a **State Transition Diagram (FSM)** modeled in **Mermaid**. This process was crucial:
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
