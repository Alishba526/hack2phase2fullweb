---
name: auth-skill
description: Implement secure authentication systems including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Authentication Skill

## Instructions

1. **User Signup**
   - Validate user input (email, password)
   - Hash passwords securely before storing
   - Prevent duplicate accounts
   - Store user data in database

2. **User Signin**
   - Verify user credentials
   - Compare hashed passwords
   - Handle invalid login attempts
   - Return authentication response

3. **Password Security**
   - Use industry-standard hashing (bcrypt / argon2)
   - Never store plain-text passwords
   - Apply proper salt rounds
   - Support password reset flow

4. **JWT Authentication**
   - Generate JWT tokens on successful signin
   - Include user claims in token payload
   - Set token expiration
   - Verify tokens on protected routes

5. **Better Auth Integration**
   - Configure Better Auth provider
   - Enable session-based or token-based auth
   - Protect API routes and pages
   - Handle logout and session invalidation

## Best Practices
- Always hash passwords before storing
- Use HTTP-only cookies for tokens when possible
- Set short-lived access tokens
- Implement refresh token strategy
- Secure routes with middleware
- Follow OWASP authentication guidelines

## Example Structure
```ts
// Signup
const hashedPassword = await bcrypt.hash(password, 10);

await db.user.create({
  data: {
    email,
    password: hashedPassword,
  },
});

// Signin
const isValid = await bcrypt.compare(password, user.password);

if (!isValid) throw new Error("Invalid credentials");

// JWT
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);



---

### Why this skill is 🔥 for you
- Directly matches **Next.js + API routes**
- Required for **automation agencies**
- Shows **security awareness** (huge hiring signal)
- Essential for **AI dashboards, SaaS, internal tools**

If you want, next I can:
- Convert this into a **Next.js App Router auth skill**
- Add **Better Auth + Prisma version**
- Turn this into a **portfolio-ready skill demo**
- Create a **step-by-step learning roadmap** for mastering auth

Just say the word 🚀
