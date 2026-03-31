import { Submission, Homework, Task } from "../models";
import { AppError } from "../middleware";
import {
  SaveSubmissionInput,
  SubmitSubmissionInput,
  GradeSubmissionInput,
  ReturnSubmissionInput,
} from "../validators";

export async function getStudentSubmission(
  homeworkId: string,
  studentId: string
) {
  const submission = await Submission.findOne({
    homework: homeworkId,
    student: studentId,
  }).populate("task");

  if (!submission) {
    throw new AppError(404, "Жұмыс табылмады");
  }

  const homework = await Homework.findById(homeworkId);

  return { submission, homework };
}

export async function saveProgress(
  homeworkId: string,
  studentId: string,
  data: SaveSubmissionInput
) {
  const submission = await Submission.findOne({
    homework: homeworkId,
    student: studentId,
  });

  if (!submission) {
    throw new AppError(404, "Жұмыс табылмады");
  }

  if (submission.status === "submitted" || submission.status === "graded") {
    throw new AppError(400, "Жіберілген немесе бағаланған жұмысты өңдеуге болмайды");
  }

  submission.blocks = data.blocks;
  submission.generatedHtml = data.generatedHtml;
  await submission.save();

  return submission;
}

export async function submitWork(
  homeworkId: string,
  studentId: string,
  data: SubmitSubmissionInput
) {
  const submission = await Submission.findOne({
    homework: homeworkId,
    student: studentId,
  });

  if (!submission) {
    throw new AppError(404, "Жұмыс табылмады");
  }

  if (submission.status === "submitted" || submission.status === "graded") {
    throw new AppError(400, "Жұмыс бұрын жіберілген");
  }

  submission.blocks = data.blocks;
  submission.generatedHtml = data.generatedHtml;
  submission.status = "submitted";
  submission.submittedAt = new Date();
  await submission.save();

  return submission;
}

export async function gradeSubmission(
  submissionId: string,
  teacherId: string,
  data: GradeSubmissionInput
) {
  const submission = await Submission.findById(submissionId).populate(
    "homework"
  );

  if (!submission) {
    throw new AppError(404, "Жұмыс табылмады");
  }

  const homework = await Homework.findById(submission.homework);
  if (!homework || homework.teacher.toString() !== teacherId) {
    throw new AppError(403, "Бұл жұмысты бағалауға рұқсатыңыз жоқ");
  }

  submission.grade = data.grade;
  submission.feedback = data.feedback;
  submission.feedbackAnnotations = data.feedbackAnnotations;
  submission.status = "graded";
  submission.gradedAt = new Date();
  await submission.save();

  return submission;
}

export async function returnSubmission(
  submissionId: string,
  teacherId: string,
  data: ReturnSubmissionInput
) {
  const submission = await Submission.findById(submissionId);

  if (!submission) {
    throw new AppError(404, "Жұмыс табылмады");
  }

  const homework = await Homework.findById(submission.homework);
  if (!homework || homework.teacher.toString() !== teacherId) {
    throw new AppError(403, "Рұқсатыңыз жоқ");
  }

  submission.feedback = data.feedback;
  submission.feedbackAnnotations = data.feedbackAnnotations;
  submission.status = "returned";
  submission.grade = undefined;
  await submission.save();

  return submission;
}

export async function getSubmissionById(submissionId: string) {
  const submission = await Submission.findById(submissionId)
    .populate("student", "name email")
    .populate("task")
    .populate("homework", "title topic");

  if (!submission) {
    throw new AppError(404, "Жұмыс табылмады");
  }

  return submission;
}

export async function getClassStats(classId: string, teacherId: string) {
  const homeworks = await Homework.find({
    classId,
    teacher: teacherId,
  });

  if (homeworks.length === 0) {
    return { homeworks: [], studentStats: [] };
  }

  const homeworkIds = homeworks.map((h) => h._id);
  const submissions = await Submission.find({
    homework: { $in: homeworkIds },
  }).populate("student", "name email");

  const studentMap = new Map<
    string,
    {
      name: string;
      email: string;
      total: number;
      submitted: number;
      graded: number;
      avgGrade: number;
      grades: number[];
    }
  >();

  for (const sub of submissions) {
    const sid = sub.student.toString();
    const student = sub.student as any;

    if (!studentMap.has(sid)) {
      studentMap.set(sid, {
        name: student.name || "Unknown",
        email: student.email || "",
        total: 0,
        submitted: 0,
        graded: 0,
        avgGrade: 0,
        grades: [],
      });
    }

    const stats = studentMap.get(sid)!;
    stats.total++;
    if (sub.status === "submitted" || sub.status === "graded") {
      stats.submitted++;
    }
    if (sub.status === "graded" && sub.grade !== undefined) {
      stats.graded++;
      stats.grades.push(sub.grade);
    }
  }

  const studentStats = Array.from(studentMap.entries()).map(([id, stats]) => ({
    studentId: id,
    name: stats.name,
    email: stats.email,
    totalAssignments: stats.total,
    submittedCount: stats.submitted,
    gradedCount: stats.graded,
    averageGrade:
      stats.grades.length > 0
        ? Math.round(
            (stats.grades.reduce((a, b) => a + b, 0) / stats.grades.length) *
              10
          ) / 10
        : null,
  }));

  return {
    totalHomeworks: homeworks.length,
    studentStats,
  };
}

export async function getTeacherGrades(
  teacherId: string,
  classId?: string
) {
  const query: Record<string, any> = { teacher: teacherId };
  if (classId) query.classId = classId;

  const homeworks = await Homework.find(query)
    .populate("classId", "name")
    .sort({ createdAt: -1 });

  if (homeworks.length === 0) {
    return [];
  }

  const homeworkIds = homeworks.map((h) => h._id);
  const submissions = await Submission.find({
    homework: { $in: homeworkIds },
  })
    .populate("student", "name email")
    .populate("homework", "title topic classId");

  await Homework.populate(submissions, {
    path: "homework.classId",
    select: "name",
  });

  return submissions.map((sub) => {
    const hw = sub.homework as any;
    const student = sub.student as any;
    return {
      _id: sub._id,
      studentName: student?.name || "Unknown",
      studentEmail: student?.email || "",
      homeworkTitle: hw?.title || "",
      homeworkTopic: hw?.topic || "",
      className: hw?.classId?.name || "",
      status: sub.status,
      grade: sub.grade ?? null,
      feedback: sub.feedback || "",
      submittedAt: sub.submittedAt,
      gradedAt: sub.gradedAt,
    };
  });
}

export async function getStudentGrades(studentId: string) {
  const submissions = await Submission.find({ student: studentId })
    .populate({
      path: "homework",
      select: "title topic classId dueDate",
      populate: { path: "classId", select: "name" },
    })
    .sort({ createdAt: -1 });

  return submissions.map((sub) => {
    const hw = sub.homework as any;
    return {
      _id: sub._id,
      homeworkTitle: hw?.title || "",
      homeworkTopic: hw?.topic || "",
      className: hw?.classId?.name || "",
      dueDate: hw?.dueDate || null,
      status: sub.status,
      grade: sub.grade ?? null,
      feedback: sub.feedback || "",
      submittedAt: sub.submittedAt,
      gradedAt: sub.gradedAt,
    };
  });
}
