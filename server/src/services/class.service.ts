import { Class, Homework, Task, Submission } from "../models";
import { AppError } from "../middleware";
import { CreateClassInput, JoinClassInput } from "../validators";
import { generateJoinCode } from "../utils/generateCode";

export async function createClass(teacherId: string, data: CreateClassInput) {
  let joinCode: string;
  let codeExists = true;

  do {
    joinCode = generateJoinCode();
    codeExists = !!(await Class.findOne({ joinCode }));
  } while (codeExists);

  const newClass = await Class.create({
    name: data.name,
    teacher: teacherId,
    joinCode,
    joinPassword: data.joinPassword,
    students: [],
  });

  return newClass;
}

export async function getTeacherClasses(teacherId: string) {
  return Class.find({ teacher: teacherId })
    .populate("students", "name email")
    .sort({ createdAt: -1 });
}

export async function getClassById(classId: string, teacherId: string) {
  const cls = await Class.findOne({ _id: classId, teacher: teacherId })
    .populate("students", "name email");

  if (!cls) {
    throw new AppError(404, "Сынып табылмады");
  }

  return cls;
}

export async function joinClass(studentId: string, data: JoinClassInput) {
  const cls = await Class.findOne({ joinCode: data.joinCode });
  if (!cls) {
    throw new AppError(404, "Сынып табылмады. Қосылу кодын тексеріңіз.");
  }

  if (cls.joinPassword !== data.joinPassword) {
    throw new AppError(401, "Сынып құпия сөзі қате");
  }

  const alreadyJoined = cls.students.some(
    (s) => s.toString() === studentId
  );
  if (alreadyJoined) {
    throw new AppError(409, "Сіз бұл сыныпқа бұрын қосылғансыз");
  }

  cls.students.push(studentId as any);
  await cls.save();

  await assignExistingHomework(cls._id.toString(), studentId);

  return cls;
}

async function assignExistingHomework(classId: string, studentId: string) {
  const homeworks = await Homework.find({ classId });

  for (const hw of homeworks) {
    const alreadyAssigned = hw.assignedTasks.some(
      (at) => at.student.toString() === studentId
    );
    if (alreadyAssigned) continue;

    const assignedTaskIds = new Set(
      hw.assignedTasks.map((at) => at.task.toString())
    );

    const allTopicTasks = await Task.find({ topic: hw.topic });
    if (allTopicTasks.length === 0) continue;

    let availableTasks = allTopicTasks.filter(
      (t) => !assignedTaskIds.has(t._id.toString())
    );

    const pool = availableTasks.length > 0 ? availableTasks : allTopicTasks;
    const randomTask = pool[Math.floor(Math.random() * pool.length)];

    hw.assignedTasks.push({
      student: studentId as any,
      task: randomTask._id,
    });
    await hw.save();

    await Submission.create({
      homework: hw._id,
      task: randomTask._id,
      student: studentId,
      blocks: [],
      generatedHtml: "",
      status: "in_progress",
    });
  }
}

export async function getStudentClasses(studentId: string) {
  return Class.find({ students: studentId })
    .populate("teacher", "name email")
    .sort({ createdAt: -1 });
}

export async function removeStudent(
  classId: string,
  studentId: string,
  teacherId: string
) {
  const cls = await Class.findOne({ _id: classId, teacher: teacherId });
  if (!cls) {
    throw new AppError(404, "Сынып табылмады");
  }

  cls.students = cls.students.filter((s) => s.toString() !== studentId);
  await cls.save();
  return cls;
}
