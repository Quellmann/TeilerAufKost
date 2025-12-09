import express from "express";
import cors from "cors";
import { connectToDatabase } from "./utils/db.js";

import groupRoutes from "./routes/groupRoutes.js"
import spendingRoutes from "./routes/spendingRoutes.js"

const app = express();
await connectToDatabase()

app.use(cors());
app.use(express.json());

app.use(groupRoutes);
app.use(spendingRoutes);

app.listen(3000, () => {
    console.log(`Server listening on port 3000`);
});