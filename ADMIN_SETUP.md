# ตั้งค่าหลังบ้าน Phonnapa Studio

หลังบ้านอยู่ที่ `/admin/` และมี 3 เมนู: ปรับราคาบริการ, ปรับตารางคิวล่วงหน้า 2 เดือน และจัดการรูปโปรโมชั่น

## 1. สร้าง Supabase project

สร้างโปรเจกต์ที่ https://supabase.com แล้วเปิด **SQL Editor** จากนั้นคัดลอกเนื้อหาทั้งหมดใน `supabase/migrations/001_admin.sql` ไปรัน

หากเคยรัน `001_admin.sql` เวอร์ชันเดิมไปแล้ว ให้รัน `supabase/migrations/002_schedule_promotions.sql` เพิ่มอีกครั้งแทนการรัน 001 ซ้ำ

หากรัน `002_schedule_promotions.sql` แล้ว ให้รัน `supabase/migrations/003_public_customer_names.sql` ต่อ เพื่อเอาช่องหมายเหตุออกและให้หน้าคิวอ่านชื่อลูกค้าได้

## 2. สร้างบัญชีผู้ดูแล

ไปที่ **Authentication > Users > Add user** แล้วสร้างอีเมลและรหัสผ่านสำหรับร้าน จากนั้นกลับไปที่ SQL Editor และรัน โดยเปลี่ยนอีเมลให้ตรงกับบัญชีที่สร้าง:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'your-email@example.com';
```

## 3. เชื่อมโปรเจกต์เว็บ

คัดลอก `.env.example` เป็น `.env` และใส่ค่าจาก **Project Settings > API**:

```env
PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

ใช้เฉพาะ Publishable/Anon key เท่านั้น ห้ามใส่ `service_role` key ในไฟล์เว็บ

หลังแก้ `.env` ให้ปิดและเปิด development server ใหม่:

```powershell
npm run dev
```

จากนั้นเปิด http://localhost:4321/admin/

ระบบจะลบคิวก่อนวันปัจจุบันเมื่อผู้ดูแลเข้าสู่หลังบ้าน โดยไม่ต้องตั้ง Cron ชื่อลูกค้าจะถูกแสดงในหน้าคิวสาธารณะเฉพาะรอบที่มีสถานะ “เต็มแล้ว” หากเคยรัน migration 002 ให้รัน `supabase/migrations/004_remove_schedule_cron.sql` หนึ่งครั้งเพื่อยกเลิก Cron เดิม

## สถิติการเข้าชมด้วย Google Analytics 4

สร้าง GA4 Property และ Web data stream ที่ Google Analytics แล้วนำ Measurement ID ซึ่งขึ้นต้นด้วย `G-` มาใส่ใน `PUBLIC_GA_MEASUREMENT_ID` จากนั้น restart development server หรือ deploy เว็บใหม่ หน้าแรกและหน้าคิวจะเริ่มส่งสถิติ ส่วนหลังบ้านมีปุ่มเปิดรายงาน Google Analytics โดยตรงและจะไม่ถูกนับเป็นผู้เข้าชม

## การ Deploy

ค่าทั้งสองตัวต้องถูกเพิ่มเป็น environment variables ในระบบ deploy ด้วย หน้าเว็บสาธารณะจะอ่านราคาและตารางคิวจาก Supabase ส่วนค่าที่อยู่ในโค้ดเดิมจะทำหน้าที่เป็นข้อมูลสำรองหากยังไม่ได้เชื่อมต่อ
