# How to Run the Full Project (Backend + Frontend)

---

## **1. Make sure your database is configured**

- Run:

```bash
cd backend
npm run db:setup
```

---

## **2. Start both servers together**

From the **root directory**:

```bash
npm run dev
```

This will:

- Start the **backend server** (`http://localhost:5000`)
- Start the **frontend React app** (`http://localhost:3000` by default)
- Both will run **simultaneously**

---

## **3. Access your app**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **WebSocket:** ws://localhost:5000 (configured in `.env`)

---

## **Notes**

- Make sure `.env` files are configured correctly.
- If you see `ERR_CONNECTION_REFUSED`, ensure backend is running.
- If you see `VITE_WS_URL is not set!`, check `frontend/.env`.

---

This is the **fastest way to run your full system** for development and testing.
