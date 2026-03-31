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
    throw new AppError(404, "Submission not found");
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
    throw new AppError(404, "Submission not found");
  }

  if (submission.status === "submitted" || submission.status === "graded") {
    throw new AppError(400, "Cannot edit a submitted or graded submission");
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
    throw new AppError(404, "Submission not found");
  }

  if (submission.status === "submitted" || submission.status === "graded") {
    throw new AppError(400, "Work already submitted");
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
    throw new AppError(404, "Submission not found");
  }

  const homework = await Homework.findById(submission.homework);
  if (!homework || homework.teacher.toString() !== teacherId) {
    throw new AppError(403, "Not authorized to grade this submission");
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
    throw new AppError(404, "Submission not found");
  }

  const homework = await Homework.findById(submission.homework);
  if (!homework || homework.teacher.toString() !== teacherId) {
    throw new AppError(403, "Not authorized");
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
    throw new AppError(404, "Submission not found");
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
