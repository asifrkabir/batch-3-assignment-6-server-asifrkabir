import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

// Parsers
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("App is listening on port 5000");
});

export default app;
