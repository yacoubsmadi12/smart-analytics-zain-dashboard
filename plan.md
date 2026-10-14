# SmartAnalytics Platform Audit & Consolidation

## الهدف
رفع المنصة إلى تجربة تشغيل احترافية لقيادات الاتصالات والهندسة والتسويق، مع إزالة التكرار من التنقل دون حذف مسارات قديمة أو كسر الصلاحيات والـ APIs.

## قرارات الدمج الآمن
- الإبقاء على كل المسارات القديمة كـ aliases في التوجيه.
- إزالة عناصر التنقل التي تشير إلى نفس المسار:
  - Network Overview مع Network.
  - Problem Areas Map مع Intelligence Map.
  - Data Sources مع Data Management.
  - Roles & Permissions مع User Management.
- الإبقاء على RF Performance كمساحة هندسية متخصصة، وعلى Network كصفحة تشغيلية؛ كلاهما مختلف وظيفيًا رغم قرب المجال.
- الإبقاء على Customer Experience وComplaints منفصلتين: الأولى لرحلة العميل ومخاطر churn، والثانية لخريطة الشكاوى وعمليات المعالجة.

## تصميم التجربة
- **Design movement:** Mission-control editorial UI for telecom operations.
- **Core principles:** signal before decoration، explainable decisions، role-aware density، progressive disclosure.
- **Color philosophy:** navy/teal يعكس غرفة عمليات موثوقة، مع amber للإنذار وred للتصعيد وgreen للسلامة.
- **Layout paradigm:** panels ذات تسلسل تشغيلي من signal → impact → action، لا صفحات مؤشرات متكررة.
- **Signature elements:** section kickers بنمط telemetry، source/status strips، decision cards ذات action واضح.
- **Interaction:** البحث والفلاتر لا تغيّر KPIs؛ القوائم الكبيرة progressive؛ الخريطة تعرض cluster قبل التفاصيل.
- **Typography:** Inter/Manrope للنصوص وDM Mono للـ telemetry والبيانات.
- **Brand essence:** منصة قرار اتصالات تربط الشبكة بالعميل والقيمة التجارية قبل أن يتحول الخلل إلى خسارة. شخصية: حاسمة، تفسيرية، تشغيلية.

## البنية
- `client/src/pages/Home.tsx`: shell والتنقل.
- `client/src/pages/*`: مجالات الشبكة، CX، الشكاوى، الأعمال والإدارة.
- `client/src/components/Map.tsx`: خريطة Leaflet/OSM مشتركة.
- `server/routers.ts` و`server/db.ts`: APIs والتدقيق والصلاحيات.
- `client/public/manus-routes.json`: route manifest للمنصة الذي يخدمه Vite.

## معايير القبول
- لا يختفي أي route قديم.
- لا توجد عناصر تنقل مكررة لنفس الـ slug.
- TypeScript، tests، build وHTTP preview تبقى ناجحة.
- لا تتغير صلاحيات أو مصادر البيانات أو KPIs بسبب إعادة التنظيم.
