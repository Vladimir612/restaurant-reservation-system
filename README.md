---
title: 'Restaurant Reservation System'
description: 'Restaurant Reservation System built with NestJS, featuring authentication, GraphQL support, and validation.'
author: 'Vladimir Lazarevic'
---

# How to Run

```bash
npm install
npm run start
```

---

# Initial User Setup (Creating or Using Admin Accounts)

After starting the application, open **Swagger UI** at:

```
http://localhost:5000/docs
```

Swagger provides full documentation for all REST endpoints, including user creation.

## 1. Creating a New Bootstrap User (DEV ONLY)

To initialize the system, you may create a basic user using the:

### **POST `/users/bootstrap`** endpoint

You can find it in Swagger under:

```
Users → POST /users/bootstrap
```

Details:

- Requires only **email** and **password** in the request body
- Always creates a user with the **OPERATOR** role
- Does **not** require authentication
- For development use only

Example body:

```json
{
  "email": "bootstrap@test.com",
  "password": "Password123!"
}
```

After creating this bootstrap user, connect to the database and manually update:

```json
{ "role": "SUPER_ADMIN" }
```

if you want to promote the user to full admin privileges.

---

# Existing Users You Can Log Into

All predefined accounts use the same password:

### **Password:** `Password123!`

---

## SUPER_ADMIN (full system access)

| \_id                     | Email                                           | Role        |
| ------------------------ | ----------------------------------------------- | ----------- |
| 6930a3fd480af990d7314d52 | [bootstrap@test.com](mailto:bootstrap@test.com) | SUPER_ADMIN |

---

## RESTAURANT_ADMIN users

| \_id                     | Email                                                   | Role             | restaurantId             |
| ------------------------ | ------------------------------------------------------- | ---------------- | ------------------------ |
| 6930aac88afe0cc274900e83 | [new.operator2@test.com](mailto:new.operator2@test.com) | RESTAURANT_ADMIN | 69308cd3e4b6d388c08255b9 |
| 6930ab6489e70502cc5b49ae | [new.operator6@test.com](mailto:new.operator6@test.com) | RESTAURANT_ADMIN | 69308cd3e4b6d388c08255b9 |
| 6930a76d0520b6d31dbcf3e0 | [new.operator@test.com](mailto:new.operator@test.com)   | RESTAURANT_ADMIN | 69308cd3e4b6d388c08255b9 |

---

## OPERATOR users

| \_id                     | Email                                                   | Role     | restaurantId             |
| ------------------------ | ------------------------------------------------------- | -------- | ------------------------ |
| 6930aad38afe0cc274900e86 | [new.operator3@test.com](mailto:new.operator3@test.com) | OPERATOR | 69308cd3e4b6d388c08255b9 |
| 6930ab018afe0cc274900e8c | [new.operator4@test.com](mailto:new.operator4@test.com) | OPERATOR | 69308cd3e4b6d388c08255b9 |
| 6930ab178afe0cc274900e90 | [new.operator5@test.com](mailto:new.operator5@test.com) | OPERATOR | 69308cd3e4b6d388c08255b9 |

---

# Notes on Testing

- Use **Swagger** for all REST endpoints.
- For GraphQL:
  - **Older commits** (before JWT auth) can be tested via the built-in GraphQL playground.
  - **Newer commits** require **Postman** or any GraphQL client that supports sending cookies.

---

# Optional Tasks Covered

## Reservation time validation

**Commit:** `8bc1494`
Added a rule preventing reservation creation when the requested time is outside the restaurant’s `openHour`–`closeHour` range.

---

## Custom GraphQL DateTimeUtc scalar

**Commit:** `8bc1494`
Introduced a custom scalar enforcing strict ISO-8601 UTC formatting for all GraphQL date inputs.

---

## `reservationCount` field resolver

**Commit:** `1128805`
Added a GraphQL field resolver that dynamically returns the number of reservations for a restaurant.

---

## JWT authentication & authorization

**Commit:** `6e8bd6a`
Implemented login with an HTTP-only cookie and JWT protection for REST and GraphQL routes.

Role system:

- **SUPER_ADMIN** – full access to all resources
- **RESTAURANT_ADMIN** – can manage only restaurants they are assigned to
- **OPERATOR** – can view data for their assigned restaurant but cannot create reservations

Authorization checks use **role + restaurant scope**.

---

## Strict TypeScript

**Commit:** `a596052`
Resolved all strict-mode TypeScript issues (DTO typing, payloads, null checks, no implicit `any`, etc.).

---

## Unit and integration tests

**Commit:** `7aa5495`
Added Jest-based unit and integration tests for restaurant and reservation logic.

---
