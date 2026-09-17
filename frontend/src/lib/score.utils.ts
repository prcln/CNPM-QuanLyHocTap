


export const calculateGradeDetail = (
  attendance: number,
  midterm: number,
  practical: number,
  finalExam: number,
): { overallScore: number; gpaScore: number; letterGrade: string } => {
  // Typical weights: Attendance 10%, Practical/Project 20%, Midterm 20%, Final Exam 50%
  const raw = attendance * 0.1 + practical * 0.2 + midterm * 0.2 + finalExam * 0.5
  const overallScore = Math.round(raw * 10) / 10

  let gpaScore = 0
  let letterGrade = 'F'

  if (overallScore >= 9.0) {
    gpaScore = 4.0
    letterGrade = 'A+'
  } else if (overallScore >= 8.5) {
    gpaScore = 3.7
    letterGrade = 'A'
  } else if (overallScore >= 8.0) {
    gpaScore = 3.5
    letterGrade = 'B+'
  } else if (overallScore >= 7.0) {
    gpaScore = 3.0
    letterGrade = 'B'
  } else if (overallScore >= 6.5) {
    gpaScore = 2.5
    letterGrade = 'C+'
  } else if (overallScore >= 5.5) {
    gpaScore = 2.0
    letterGrade = 'C'
  } else if (overallScore >= 5.0) {
    gpaScore = 1.5
    letterGrade = 'D+'
  } else if (overallScore >= 4.0) {
    gpaScore = 1.0
    letterGrade = 'D'
  } else {
    gpaScore = 0.0
    letterGrade = 'F'
  }

  return { overallScore, gpaScore, letterGrade }
}