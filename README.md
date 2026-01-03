# NexusChat

NexusChat is a modern, real-time video and text chat application that connects users randomly for one-on-one conversations. Built as a high-performance Omegle clone, it utilizes WebRTC for peer-to-peer streaming and a microservices backend architecture to handle user matching and signaling efficiently.

## Features

* **Random Matching**: efficient queue-based system to pair users instantly.
* **P2P Video & Audio**: Low-latency communication using WebRTC (`simple-peer`).
* **Real-time Chat**: WebSocket-based text messaging synchronized with video sessions.
* **Modern UI**: Responsive, dark-themed interface built with Tailwind CSS and Shadcn UI.
* **Session Control**: seamless "Skip" functionality to disconnect and find a new partner immediately.

## Tech Stack

### Frontend

* **Framework**: React (Vite) + TypeScript
* **Styling**: Tailwind CSS
* **UI Components**: Shadcn UI + Radix Primitives
* **WebRTC**: `simple-peer-light`
* **Icons**: Lucide React

### Backend

The backend is split into two microservices to decouple matching logic from connection handling:

1. **Matching Service** (`/matching-service`):
* Built with **FastAPI**.
* Manages the user queue and pairs users using **Redis** (Sorted Sets).
* Handles the initial handshake and room creation.


2. **Signalling Service** (`/signalling-service`):
* Built with **FastAPI**.
* Facilitates the WebRTC SDP and ICE candidate exchange via WebSockets.
* Validates user roles (Initiator vs. Responder) via Redis.



### Infrastructure

* **Database**: Redis (used for both the matching queue and ephemeral room state).
* **Transport**: WebSockets for signaling and chat events.

## Installation & Setup

### Prerequisites

* Node.js & npm/bun
* Python 3.11+
* Redis (Must be running on port `6379`)

### 1. Start the Database

Ensure your local Redis instance is running:

```bash
redis-server

```

### 2. Run the Backend Services

You need to run both services simultaneously.

**Matching Service:**

```bash
cd NexusChat/Backend/matching-service
pip install fastapi uvicorn redis
uvicorn main:app --port 8000 --reload

```

**Signalling Service:**

```bash
cd NexusChat/Backend/signalling-service
pip install fastapi uvicorn redis
uvicorn main:app --port 8001 --reload

```

### 3. Run the Frontend

```bash
cd NexusChat/Frontend
npm install
npm run dev

```

The application will be available at `http://localhost:5173` (or the port specified by Vite).

## Architecture Overview

1. **Registration**: Users connect to the **Matching Service** and are added to a Redis queue.
2. **Matching**: A background worker pairs users, creates a room ID, and assigns roles (Initiator/Responder).
3. **Handoff**: Clients receive the room ID and connect to the **Signalling Service**.
4. **Connection**: WebRTC offers/answers are exchanged through the signalling server, establishing a direct P2P video connection.
