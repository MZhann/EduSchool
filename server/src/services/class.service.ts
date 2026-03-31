import { Class } from "../models";
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
    throw new AppError(404, "Class not found");
  }

  return cls;
}

export async function joinClass(studentId: string, data: JoinClassInput) {
  const cls = await Class.findOne({ joinCode: data.joinCode });
  if (!cls) {
    throw new AppError(404, "Class not found. Check the join code.");
  }

  if (cls.joinPassword !== data.joinPassword) {
    throw new AppError(401, "Incorrect class password");
  }

  const alreadyJoined = cls.students.some(
    (s) => s.toString() === studentId
  );
  if (alreadyJoined) {
    throw new AppError(409, "You have already joined this class");
  }

  cls.students.push(studentId as any);
  await cls.save();

  return cls;
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
    throw new AppError(404, "Class not found");
  }

  cls.students = cls.students.filter((s) => s.toString() !== studentId);
  await cls.save();
  return cls;
}
