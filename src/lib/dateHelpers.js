import { newDate } from 'date-fns-jalali';

/**
 * دریافت تاریخ امروز به‌صورت شیء Date
 * @returns {Date}
 */
export function getToday() {
  return new Date();
}

/**
 * فرمت تاریخ شمسی به‌صورت YYYY/MM/DD
 * @param {Date} date
 * @returns {string}
 */
export function toJalali(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', options);
  return formatter.format(date);
}

/**
 * تبدیل ارقام فارسی/عربی به انگلیسی
 */
function toWesternDigits(str) {
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  const arabic = '٠١٢٣٤٥٦٧٨٩';
  return str.replace(/[۰-۹]/g, d => persian.indexOf(d))
           .replace(/[٠-٤٥-٩]/g, d => arabic.indexOf(d));
}

/**
 * تبدیل تاریخ میلادی به شمسی با استفاده از Intl (بدون کتابخانه خارجی)
 * @param {Date} date
 * @returns {{ year: number, month: number, day: number }}
 */
export function toJalaliParts(date) {
  const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);

  const get = (type) => Number(toWesternDigits(parts.find(p => p.type === type)?.value || ''));
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
  };
}

/**
 * بررسی اینکه آیا دو تاریخ شمسی در یک روز هستند
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
export function isSameJalaliDay(date1, date2) {
  const d1 = toJalaliParts(date1);
  const d2 = toJalaliParts(date2);
  return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
}

/**
 * تبدیل تاریخ شمسی (YYYY/MM/DD) به تاریخ میلادی (YYYY-MM-DD) برای ارسال به API
 * @param {string} jalaliStr - مثلاً "1404/06/15"
 * @returns {string} - مثلاً "2025-09-06"
 */
export function fromJalali(jalaliStr) {
  if (!jalaliStr) return '';
  const parts = jalaliStr.split('/');
  if (parts.length !== 3) return '';
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return '';
  const date = newDate(y, m - 1, d);
  return date.toISOString().slice(0, 10);
}

/**
 * دریافت تاریخ امروز به صورت شمسی YYYY/MM/DD
 * @returns {string}
 */
export function getJalaliToday() {
  const now = new Date();
  const p = toJalaliParts(now);
  return `${p.year}/${String(p.month).padStart(2, '0')}/${String(p.day).padStart(2, '0')}`;
}