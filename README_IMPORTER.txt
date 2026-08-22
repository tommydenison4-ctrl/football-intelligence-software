ULM Football Intelligence V2 — PFF Master Importer

NEW IN THIS BUILD
- Data Center accepts large PFF CSV exports.
- Detects teams and games automatically.
- Supports two master-file types:
  * Opponent Defenses -> Offensive Intelligence
  * Opponent Offenses -> Defensive Intelligence
- Deduplicates by dataset side + PFF game ID + PFF play ID.
- Special UAB rule: when importing opponent defenses, OKST is recognized automatically and only its first four 2025 defensive games are included as a Todd Grantham / UAB 2026 scheme reference.
- Later Oklahoma State games are excluded from that import.
- The raw team remains Oklahoma State; UAB is stored only as scheme_reference_for.

SETUP
1. Run supabase_importer_schema.sql once in the existing Supabase SQL Editor.
2. Upload this build to the root of the existing GitHub repo and commit.
3. Let Vercel redeploy.
4. Open Data Center.
5. Sign in with a Supabase authenticated user before importing.
6. Choose a large PFF CSV, review detected teams/games, then import.

The original supabase_v2_schema.sql is still included for reference. Do not rerun it unless needed.
