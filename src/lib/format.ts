export function formatCourseCode(code: string): string {
  return code.replace(/([A-Za-z]+)(\d+)/, "$1 $2");
}
