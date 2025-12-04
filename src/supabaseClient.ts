import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://yoywqaafwjzroiplbkdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlveXdxYWFmd2p6cm9pcGxia2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4Mzk2MjMsImV4cCI6MjA3OTQxNTYyM30.cwD-5j8qSNRcPH-iEbfh8ge9PA-GUlc90PIDQ3Yb1FQ'
);
