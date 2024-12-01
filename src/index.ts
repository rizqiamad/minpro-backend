import express from "express";
import cors from "cors";

const app = express()

const PORT = 8000

app.use(express.json())
app.use(cors())

app.listen(PORT, () => console.log(`Server running in --> http://localhost:${PORT}`))