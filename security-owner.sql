-- Replace the email below with your own login email, then run once in Supabase SQL Editor.
update public."Profile" set plan='PRO',role='OWNER',status='ACTIVE',"updatedAt"=now() where email='YOUR_EMAIL_HERE';
