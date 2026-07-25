# Rangani Parivaar Backend

Production-ready Express.js + MongoDB API for Rangani Parivaar.

## Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- express-validator
- helmet, cors, morgan, cookie-parser, multer, dotenv, nodemon

## Getting started

```bash
cd rangani_be
cp .env.example .env
npm install
npm run dev
```

If local MongoDB is not running, development mode automatically starts an in-memory MongoDB and seeds demo data.

With a real MongoDB instance:

```bash
npm run seed
npm run dev
```

## Demo credentials

| Role | Identifier | Next step |
|------|------------|-----------|
| Admin | `admin@rangani.com` / `9876543210` | Password `admin123` |
| Manager | `manager@rangani.com` / `9123456780` | Password `manager123` |
| User | `user@rangani.com` / `9988776655` | OTP `123456` |

## Environment

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/rangani_parivaar
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
OTP_EXPIRY=300
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## API base

`http://localhost:5000/api`

### Auth

- `POST /auth/identify` (email/phone lookup → password or OTP)
- `POST /auth/login` (Admin/Manager password)
- `POST /auth/admin/login` (legacy)
- `POST /auth/manager/login` (legacy)
- `POST /auth/user/otp/request`
- `POST /auth/user/otp/verify`
- `GET /auth/me`
- `POST /auth/logout`

### Resources

- `GET/POST /members` · `GET/PUT/DELETE /members/:id`
- `GET/POST /families` · `GET/PUT/DELETE /families/:id`
- `GET/POST /firms` · `GET/PUT/DELETE /firms/:id`
- `GET /dashboard/stats`
- `CRUD /locations/countries|states|districts|cities`
- Nested: `/locations/countries/:countryId/states`, `/locations/states/:stateId/districts`, `/locations/districts/:districtId/cities`
- `CRUD /natives`
- `CRUD /managers` (Admin only)

Protected routes require `Authorization: Bearer <token>`.

List query params: `page`, `limit`, `search`, `sort`

## Response format

```json
{
  "success": true,
  "message": "Members fetched successfully",
  "data": {}
}
```

## Architecture

```
src/
  config/
  constants/
  controllers/
  database/
  middleware/
  models/
  routes/
  services/
  utils/
  validators/
  app.js
  server.js
```
