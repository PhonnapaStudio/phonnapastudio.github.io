-- Run once after 002_schedule_promotions.sql to remove the old scheduled cleanup.
-- Past slots are now deleted by the authenticated admin page when it opens.
do $$
declare
  cleanup_job_id bigint;
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    select jobid into cleanup_job_id
    from cron.job
    where jobname = 'phonnapa-cleanup-past-slots'
    limit 1;

    if cleanup_job_id is not null then
      perform cron.unschedule(cleanup_job_id);
    end if;
  end if;
end $$;

-- Remove the abandoned first-party visit counter, if a previous draft created it.
drop function if exists public.track_site_visit(text, uuid);
drop table if exists public.site_visits;
