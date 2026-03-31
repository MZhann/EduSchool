import { Homework, Class, Task, Submission } from "../models";
import { AppError } from "../middleware";
import { CreateHomeworkInput } from "../validators";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function createHomework(
  teacherId: string,
  data: CreateHomeworkInput
) {
  const cls = await Class.findOne({
    _id: data.classId,
    teacher: teacherId,
  });
  if (!cls) {
    throw new AppError(404, "Class not found");
  }

  if (cls.students.length === 0) {
    throw new AppError(400, "Class has no students");
  }

  const tasks = await Task.find({ topic: data.topic });
  if (tasks.length === 0) {
    throw new AppError(400, `No tasks found for topic "${data.topic}"`);
  }

  if (tasks.length < cls.students.length) {
    throw new AppError(
      400,
      `Not enough unique tasks for this topic. Need ${cls.students.length}, but only ${tasks.length} available.`
    );
  }

  const shuffledTasks = shuffleArray(tasks);
  const assignedTasks = cls.students.map((studentId, index) => ({
    student: studentId,
    task: shuffledTasks[index]._id,
  }));

  const homework = await Homework.create({
    title: data.title,
    topic: data.topic,
    classId: data.classId,
    teacher: teacherId,
    theoryContent: data.theoryContent,
    assignedTasks,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    status: "active",
  });

  for (const at of assignedTasks) {
    await Submission.create({
      homework: homework._id,
      task: at.task,
      student: at.student,
      blocks: [],
      generatedHtml: "",
      status: "in_progress",
    });
  }

  return homework;
}

export async function getTeacherHomeworks(teacherId: string, classId?: string) {
  const filter: any = { teacher: teacherId };
  if (classId) filter.classId = classId;

  return Homework.find(filter)
    .populate("classId", "name")
    .sort({ createdAt: -1 });
}

export async function getHomeworkById(homeworkId: string, userId: string) {
  const homework = await Homework.findById(homeworkId)
    .populate("classId", "name students")
    .populate("assignedTasks.task")
    .populate("assignedTasks.student", "name email");

  if (!homework) {
    throw new AppError(404, "Homework not found");
  }

  return homework;
}

export async function getStudentHomeworks(studentId: string) {
  const homeworks = await Homework.find({
    "assignedTasks.student": studentId,
  })
    .populate("classId", "name")
    .sort({ createdAt: -1 });

  const result = [];
  for (const hw of homeworks) {
    const assigned = hw.assignedTasks.find(
      (at) => at.student.toString() === studentId
    );

    const submission = await Submission.findOne({
      homework: hw._id,
      student: studentId,
    });

    result.push({
      _id: hw._id,
      title: hw.title,
      topic: hw.topic,
      classId: hw.classId,
      theoryContent: hw.theoryContent,
      dueDate: hw.dueDate,
      status: hw.status,
      taskId: assigned?.task,
      submissionStatus: submission?.status || "in_progress",
      grade: submission?.grade,
      createdAt: hw.createdAt,
    });
  }

  return result;
}

export async function getHomeworkMonitoring(
  homeworkId: string,
  teacherId: string
) {
  const homework = await Homework.findOne({
    _id: homeworkId,
    teacher: teacherId,
  }).populate("assignedTasks.student", "name email");

  if (!homework) {
    throw new AppError(404, "Homework not found");
  }

  const submissions = await Submission.find({ homework: homeworkId })
    .populate("student", "name email")
    .populate("task", "title");

  return { homework, submissions };
}

export async function closeHomework(homeworkId: string, teacherId: string) {
  const homework = await Homework.findOneAndUpdate(
    { _id: homeworkId, teacher: teacherId },
    { status: "closed" },
    { new: true }
  );

  if (!homework) {
    throw new AppError(404, "Homework not found");
  }

  return homework;
}

export async function getTopics() {
  const topics = await Task.distinct("topic");
  return topics;
}

export async function getTopicTaskCount(topic: string) {
  return Task.countDocuments({ topic });
}
