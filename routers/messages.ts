import { Router } from "express";
import { promises as fs } from "fs";
import { Message } from "../types";

const path = "./messages";

const messagesRouter = Router();

messagesRouter.get("/", async (req, res) => {
  try {
    const files = await fs.readdir(path);
    const lastMessages = files.slice(-5);

    const messages: Message[] = await Promise.all(
      lastMessages.map(async (file) => {
        const content = await fs.readFile(`${path}/${file}`);
        return {
          message: JSON.parse(content.toString()),
          datetime: file,
        };
      })
    );
    res.send(messages);
  } catch (error) {
    console.error(error);
  }
});

messagesRouter.post("/", async (req, res) => {
  try {
    const message = req.body.message;
    const datetime = new Date().toISOString();
    const fileName = `${path}/${datetime}.txt`;

    await fs.writeFile(fileName, JSON.stringify(message).toString());

    res.send({ message, datetime });
  } catch (error) {
    console.error(error);
  }
});

export default messagesRouter;
