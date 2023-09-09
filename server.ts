import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors());

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

interface DataItem {
  email: string;
  number: string;
}

const data: DataItem[] = [
  { email: "jim@gmail.com", number: "221122" },
  { email: "jam@gmail.com", number: "830347" },
  { email: "john@gmail.com", number: "221122" },
  { email: "jams@gmail.com", number: "349425" },
  { email: "jams@gmail.com", number: "141424" },
  { email: "jill@gmail.com", number: "822287" },
  { email: "jill@gmail.com", number: "822286" },
];

app.post("/search", async (req: Request, res: Response) => {
  const { email, number } = req.body;

  if (typeof email !== "string" || (number && typeof number !== "string")) {
    return res.status(400).json({ error: "Invalid input format" });
  }

  console.log("Entire body:", req.body);

  req.on("aborted", () => {
    console.log("Request aborted by the client");
    res.end();
  });

  // Email validation
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Number validation
  if (number && number.length !== 6) {
    return res
      .status(400)
      .json({ error: "Number should be in the format 6 digits" });
  }
  console.log("Received:", email, number);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const results = data.filter(
    (item) => item.email === email && (!number || item.number === number)
  );
  res.json(results);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
