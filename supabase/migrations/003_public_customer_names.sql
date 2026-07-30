-- Run after 002_schedule_promotions.sql.
-- Removes the unused note field and exposes customer names to the public queue page.
-- The website itself only renders a name when its slot status is "booked".
alter table public.schedule_slot_notes drop column if exists note;

drop policy if exists "Public can read customer names" on public.schedule_slot_notes;
create policy "Public can read customer names" on public.schedule_slot_notes
  for select to anon, authenticated using (true);

-- Remove the cleanup job created by migration 002. Old slots are now deleted
-- by the authenticated admin page whenever the schedule tab is opened.
do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'cron') then
    perform cron.unschedule('phonnapa-cleanup-past-slots');
  end if;
exception when others then null;
end $$;
