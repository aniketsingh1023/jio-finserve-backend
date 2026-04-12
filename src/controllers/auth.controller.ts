import { prisma } from "../lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// load from env
const JWT_SECRET = process.env.JWT_SECRET as string

export const signup = async (req, res) => {
  try {
   const { email, password, name, phone } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone
      }
    })

    // remove password from response
    const { password: _, ...safeUser } = user

    res.json({ message: "User created", user: safeUser })
  } catch (err) {
    res.status(400).json({ error: "User already exists" })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.status(404).json({ error: "User not found" })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  )

  res.json({ token })
}