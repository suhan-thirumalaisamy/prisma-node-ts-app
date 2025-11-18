import express, { Request, Response } from 'express';
import prisma from './client';
import 'dotenv/config';

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// --- ROUTE 1: POST (Insert Data) ---
// Create a new User and immediately create a Post for them
app.post('/users', async (req: Request, res: Response) => {
  const { name, email, title, content } = req.body;

  try {
    const result = await prisma.user.create({
      data: {
        name,
        email,
        posts: {
          create: {
            title,
            content
          }
        }
      },
      include: {
        posts: true // Return the posts in the response
      }
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating user. Email might already exist." });
  }
});

// --- ROUTE 2: GET (Fetch Data) ---
// Get all users and include their posts
app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true // Join the Post table
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server ready at: http://localhost:${PORT}`);
});