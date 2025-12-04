import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://iujxrjqasrfcbdmrrirn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1anhyanFhc3JmY2JkbXJyaXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDMzMzQsImV4cCI6MjA4MDQxOTMzNH0.FMSG1PJRxQD0ZVXFAMsgK6hehAvLLIJBmMaC6dkhxLo'
);
