# API-Server-Project
# Card Game API (Express + JWT + File Persistence)

An Express.js API server for a fictional collectible card game. Supports:
- JWT authentication via `/getToken`
- Card CRUD operations with file-based persistence in `data/cards.json`
- Protected routes (create/update/delete require a valid JWT)
- Filtering on `GET /cards` using equality match query parameters
- Error handling middleware with descriptive messages
- Optional “meta” endpoints for sets/types/rarities and extra card endpoints

## Setup

1) Install dependencies:
```bash
npm install
