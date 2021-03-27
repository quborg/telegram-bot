require('dotenv').config();

const action = 'ترك سؤال';

const CONST = {
  token: process.env.BOT_TOKEN,
  yes: 'نعم',
  no: 'لا',
  yesNo: ['نعم', 'لا'],
  start: '/start',
  welcoming: `    
  السلام عليكم ورحمة الله وبركاته
  الخدمات المتوفرة \n
  <b>* ${action} *</b>
  `,
  action,
  textChooseAction: 'اختر الخدمة أولا من القائمة أسفلا',
  textWriteQuestion: 'تفضل بكتابت سؤالك',
  textConfirmQuestion: 'المرجو التأكيد على حفظ سؤالك',
  textChooseResponse: 'المرجو اختيار الاجابة',
  textEnd: (question) =>
    `لقد تم حفظ سؤالكم\n--------------\n${question}\n--------------\nسيتم نقل الجواب اليكم في أقرب وقت.\n\nشكرا`,
};

module.exports = CONST;
