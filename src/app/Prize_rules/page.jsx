import React from 'react'
import Link from 'next/link'
import styles from './Prize_rules.module.css'

function PrizeRules() {
  return (
    <div className={styles.container}>
      <div className={styles.prizeCard}>
        <h1 className={styles.title}>قواعد الجائزة</h1>
        
        <div className={styles.prizeBox}>
          <div className={styles.prizeAmount}>
            <span className={styles.amount}>2,000</span>
            <span className={styles.currency}>جنيه مصري</span>
          </div>
          <h2 className={styles.subtitle}>لاعب الشهر</h2>
        </div>

        <div className={styles.rulesSection}>
          <h3>معلومات الجائزة:</h3>
          <ul>
            <li>قيمة الجائزة 2000 جنيه مصري شهرياً</li>
            <li>يتم منح الجائزة في بداية الشهر التالي</li>
            <li>في حالة التعادل، يتم تقسيم الجائزة بالتساوي بين اللاعبين المتعادلين</li>
          </ul>
        </div>

        <div className={styles.rulesSection}>
          <h3>شروط الفوز:</h3>
          <ul>
            <li>الفائز هو اللاعب الذي يحصل على أكبر عدد من جوائز رجل المباراة خلال الشهر</li>
            <li>يجب المشاركة في مباراة واحدة على الأقل خلال الشهر</li>
            <li>يتم تحديد رجل المباراة من خلال تصويت اللاعبين</li>
          </ul>
        </div>

        <div className={styles.rulesSection}>
          <h3>شروط المباراة المقبولة:</h3>
          <ul>
            <li>عدد اللاعبين:
              <ul>
                <li>يجب أن تحتوي المباراة على 10 لاعبين على الأقل</li>
                <li>يجب أن يحصل كل لاعب في المباراة على 6 أصوات كحد أدنى</li>
              </ul>
            </li>
            <li>معلومات المباراة:
              <ul>
                <li>يجب كتابة اسم الملعب بشكل صحيح</li>
                <li>يجب تحديد التاريخ والوقت بشكل صحيح</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className={styles.rulesSection}>
          <h3>قواعد النزاهة:</h3>
          <ul>
            <li>سيتم التحقق من صحة جميع المباريات قبل منح الجائزة</li>
            <li>في حالة اكتشاف أي تلاعب أو مباريات وهمية:
              <ul>
                <li>سيتم استبعاد اللاعب المخالف</li>
                <li>تنتقل الجائزة تلقائياً إلى اللاعب التالي في الترتيب</li>
              </ul>
            </li>
            <li>قرار لجنة التحقق نهائي وغير قابل للطعن</li>
          </ul>
        </div>


        <div className={styles.rulesSection}>
          <h3>كيفية المشاركة:</h3>
          <ul>
            <li>خطوات المشاركة:
              <ul>
                <li>يجب إنشاء حساب في الموقع أولاً</li>
                <li>إنشاء مباراة جديدة وإضافة اللاعبين المشاركين</li>
                <li>بعد انتهاء المباراة، يفتح باب التصويت</li>
                <li>كل لاعب يقوم بتقييم باقي اللاعبين في المباراة</li>
                <li>اللاعب الحاصل على أعلى تقييم يكون رجل المباراة</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div className={styles.note}>
          <p>ملحوظة: لن يتم احتساب المباريات التي لا تستوفي الشروط المذكورة أعلاه</p>
        </div>

        
        

        <Link href="/Leaderboards" className={styles.leaderboardLink}>
          شاهد ترتيب اللاعبين
        </Link>

        


      </div>
    </div>
  )
}

export default PrizeRules