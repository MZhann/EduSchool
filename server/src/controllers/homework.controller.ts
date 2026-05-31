import { Response, NextFunction } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { homeworkService } from "../services";
import { createHomeworkSchema } from "../validators";
import { AuthRequest } from "../types";
import { env } from "../config/env";

const anthropic = new Anthropic({ apiKey: env.anthropicApiKey });

export async function createHomework(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createHomeworkSchema.parse(req.body);
    const homework = await homeworkService.createHomework(
      req.user!.userId,
      data
    );
    res.status(201).json(homework);
  } catch (error) {
    next(error);
  }
}

export async function getTeacherHomeworks(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const classId = req.query.classId as string | undefined;
    const homeworks = await homeworkService.getTeacherHomeworks(
      req.user!.userId,
      classId as string | undefined
    );
    res.json(homeworks);
  } catch (error) {
    next(error);
  }
}

export async function getHomeworkById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const homework = await homeworkService.getHomeworkById(
      req.params.homeworkId as string,
      req.user!.userId
    );
    res.json(homework);
  } catch (error) {
    next(error);
  }
}

export async function getStudentHomeworks(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const homeworks = await homeworkService.getStudentHomeworks(
      req.user!.userId
    );
    res.json(homeworks);
  } catch (error) {
    next(error);
  }
}

export async function getHomeworkMonitoring(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await homeworkService.getHomeworkMonitoring(
      req.params.homeworkId as string,
      req.user!.userId
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function closeHomework(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const homework = await homeworkService.closeHomework(
      req.params.homeworkId as string,
      req.user!.userId
    );
    res.json(homework);
  } catch (error) {
    next(error);
  }
}

export async function getTopics(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const topics = await homeworkService.getTopics();
    res.json(topics);
  } catch (error) {
    next(error);
  }
}

export async function generateTheory(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, topic, className } = req.body as {
      title?: string;
      topic?: string;
      className?: string;
    };

    if (!title && !topic) {
      res.status(400).json({ message: "title немесе topic қажет" });
      return;
    }

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Сен мектеп мұғалімісің. Келесі тапсырма үшін қысқа теориялық мазмұн жаз (3-5 сөйлем):
Тапсырма тақырыбы: ${title || ""}
Пән/Тема: ${topic || ""}
Сынып: ${className || ""}

Тек маңызды ақпаратты қамт. Оқушыларға түсінікті, нұсқаулыққа дайын мәтін жаз. Тек теориялық мазмұнды жаз, қосымша түсінік берме.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    res.json({ text });
  } catch (error) {
    next(error);
  }
}
