# Knots - Modern Todo Application

A full-stack todo application built with Next.js, TypeScript, Prisma, and PostgreSQL. Features user authentication, CRUD operations, priority levels, and a responsive design.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql)

## Features

- 🔐 **User Authentication** - Secure registration and login with JWT
- ✅ **CRUD Operations** - Create, read, update, and delete todos
- 🎯 **Priority Levels** - LOW, MEDIUM, HIGH, URGENT priority options
- ✨ **Real-time Updates** - Instant UI updates
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS
- 🔒 **Type Safety** - Full TypeScript implementation

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Context** - State management

### Backend
- **Next.js API Routes** - Server-side endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/knots.git
cd knots
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/knots_db"
JWT_SECRET="your-super-secret-jwt-key-here"
```

4. **Setup database**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

5. **Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todos     Todo[]
}

model Todo {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  priority    Priority @default(MEDIUM)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Todos
- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create new todo
- `PUT /api/todos/[id]` - Update todo
- `DELETE /api/todos/[id]` - Delete todo

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma generate  # Generate Prisma client
npx prisma studio    # Open database GUI
npx prisma migrate dev --name [name]  # Create and run migration
```

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel login
vercel
```

3. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL` - Your production PostgreSQL URL
   - `JWT_SECRET` - Your JWT secret key

### Other Platforms
- Railway
- Heroku
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database management with [Prisma](https://www.prisma.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com/)
