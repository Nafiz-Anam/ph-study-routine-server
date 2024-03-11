# Study Routine Planner

## Project Objectives

The Study Routine Planner is designed to help students effectively manage their study time alongside other commitments such as classes, work, and personal activities. The primary goal is to maximize study effectiveness by allocating study tasks into a weekly schedule based on task priority and available time slots, ensuring a balanced and achievable study plan.

## Architecture Overview

The Study Routine Planner is built on a microservices architecture, utilizing a React-based frontend for user interaction and a Node.js backend for handling the core logic and database interactions. The system calculates available study times by subtracting predefined commitments from a full week's schedule, sorts study tasks by priority and duration, and then allocates these tasks into the calculated available time slots.

## Core Algorithm

<details>
<summary>Click to expand the algorithm explanation</summary>

### Step 1: Calculate Available Time Slots

-   Initially, all days are assumed to be fully available for study.
-   The algorithm subtracts blocked time slots from the full weekly schedule to calculate available time slots.

### Step 2: Consolidate Available Time

-   Adjusts the available time slots for each day based on blocked time slots, accurately accounting for busy times.

### Step 3: Sort Tasks by Priority and Duration

-   Sorts tasks by priority (high, medium, low) and duration, prioritizing important and shorter tasks.

### Step 4: Allocate Tasks to Time Slots

-   Distributes tasks across available days, ensuring no single day is overloaded.
-   Prioritizes allocation based on task priority and available time, moving unallocated tasks to a review list.

This algorithm ensures a balanced and realistic study schedule, accommodating existing commitments and prioritizing tasks effectively to maximize study time.

</details>

## Backend

-   **Node.js** for the server-side logic, providing a scalable and efficient runtime environment.
-   **MongoDB** as the database, offering flexible data storage for user profiles, study plans, and progress tracking.
-   **Express.js** framework to simplify the creation of RESTful API endpoints, facilitating communication between the frontend and backend.
-   **Authentication and authorization** implemented via **JWT** to ensure secure access to user-specific data.

## Repo Link

[Click](https://github.com/Nafiz-Anam/ph-study-routine-server) or visit here: https://github.com/Nafiz-Anam/ph-study-routine-server

## Frontend

-   **Next.js** for building a user-friendly interface, enabling server-side rendering and static site generation for faster load times.
-   **React.js** for developing reusable UI components, ensuring a dynamic and responsive user experience.
-   **Tailwind CSS** for styling, providing a utility-first approach to design with minimal custom CSS.
-   **Redux Toolkit and RTK Query** for state management, simplifying data fetching, caching, and updating the UI reactively.

## Repo Link

[Click](https://github.com/Nafiz-Anam/ph-study-routine-client) or visit here: https://github.com/Nafiz-Anam/ph-study-routine-client

## Deployment

-   Docker and Docker Compose installed on your system.
-   Basic knowledge of Docker, Node.js, and React.

## Usage Instructions

1. **Clone the repository**: `git clone https://github.com/Nafiz-Anam/ph-study-planner`
2. **Install dependencies**:
    - Backend: `cd server && npm install`
    - Frontend: `cd client && npm install`
3. **Start the application**:
    - Backend: `npm start` within the `/server` directory.
    - Frontend: `npm run dev` within the `/client` directory.
4. **Access the application**: Open `http://localhost:3000` in your web browser for **frontend**. And `http://localhost:5000/api/v1` for **backend**.

## API Collection 👇

https://documenter.getpostman.com/view/30501718/2sA2xh1Xnm
