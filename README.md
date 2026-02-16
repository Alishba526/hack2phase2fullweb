# Full Stack Todo Application

A professional, industrial-level full-stack todo application built with Next.js and FastAPI.

## 🌐 Live Links

- **Frontend**: https://frontend-l8jbfdhh0-alishbarehman-s-projects.vercel.app
- **Backend API**: https://alishbarehman-fullbackend.hf.space
- **API Docs**: https://alishbarehman-fullbackend.hf.space/docs

## 📁 Project Structure

```
full-stack-todo/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/      # Next.js App Router pages
│   │   ├── components/
│   │   ├── contexts/
│   │   └── services/
│   ├── package.json
│   └── ...
├── backend/           # FastAPI backend application
│   ├── hellobackend/
│   │   ├── src/
│   │   ├── app.py
│   │   └── ...
│   └── requirements.txt
├── specs/            # Project specifications
└── .gitignore
```

## 🚀 Features

- User authentication (register/login)
- Todo CRUD operations
- Professional error messages
- Responsive design
- Accessibility features
- Protected routes
- Token-based authentication

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- FastAPI
- Python
- SQLModel
- PostgreSQL (Neon)
- JWT Authentication

## 📦 Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend/hellobackend
pip install -r requirements.txt
python app.py
```

## 🔒 Security

- No credentials committed
- No database files in repository
- Environment variables in .env files (not committed)

## 📄 License

MIT
