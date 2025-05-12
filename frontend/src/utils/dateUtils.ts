/**
 * Định dạng ngày tháng theo định dạng Việt Nam (DD/MM/YYYY HH:MM)
 * @param date Đối tượng Date cần định dạng
 * @returns String đã định dạng
 */
export function formatDate(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Định dạng ngày tháng theo định dạng Việt Nam (DD/MM/YYYY)
 * @param date Đối tượng Date cần định dạng
 * @returns String đã định dạng
 */
export function formatDateShort(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Chuyển đổi chuỗi ngày tháng ISO thành đối tượng Date
 * @param dateString Chuỗi ngày tháng ISO
 * @returns Đối tượng Date
 */
export function parseISODate(dateString: string): Date | null {
  if (!dateString) return null;
  
  try {
    return new Date(dateString);
  } catch (error) {
    console.error('Invalid date string:', dateString);
    return null;
  }
}
