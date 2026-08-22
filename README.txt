ULM FOOTBALL INTELLIGENCE V2

WHAT CHANGED
1. One shared front door: ULM Football Intelligence.
2. Two primary branches: Offensive Intelligence and Defensive Intelligence.
3. Player Portal, Depth Chart and Data Center are shared football-intelligence tools.
4. A single opponent selector is shared across the platform using browser state today and the V2 teams table when available.
5. Supabase remains the source of truth for projects/plays and V2 adds teams, players, depth charts, reports and platform settings.
6. Old UAB-specific pages are retained only inside /legacy so nothing is lost while data is migrated.

INSTALL
1. Run supabase_v2_schema.sql once in the existing Supabase SQL Editor.
2. Upload every root file in this ZIP to the root of the existing GitHub/Vercel repository.
3. Upload the /legacy folder too as a temporary backup.
4. Commit and let Vercel redeploy.
5. Open /data-admin.html. Tables showing green counts are ready. SETUP means the SQL has not been run or the table/policy is unavailable.

IMPORTANT
The current offensive analytics page already reads projects/plays from Supabase and remains intact.
The current defensive page and some personnel/depth information still contain legacy embedded data so this build stays immediately usable. The V2 schema is the destination for migrating those remaining datasets without breaking the current site.

NEXT MIGRATION
Move defense DATA -> Supabase project/play records.
Move personnel-data.js -> players table.
Move depth chart embedded records -> depth_chart_entries.
Then remove /legacy and embedded data completely.
