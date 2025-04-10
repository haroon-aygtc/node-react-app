# Database Setup & Management Commands

Use these commands to configure, migrate, and manage your database.

---

## **Setup Database**

Check connection, run migrations, generate Prisma client:

```bash
npm run db:setup
```

---

## **Run Migrations**

Run Prisma migrations interactively:

```bash
npm run db:migrate
```

---

## **Generate Prisma Client**

Generate Prisma client after schema changes:

```bash
npm run db:generate
```

---

## **Reset Database (DANGER: deletes all data)**

Reset database and reapply migrations:

```bash
npm run db:reset
```

---

## **Notes**

- Configure your `.env` file with your database URL before running these commands.
- The setup script is located at `backend/scripts/setupDatabase.js`.
- All commands are defined in `backend/package.json` under `"scripts"`.
