ULM Unified Football Analytics Platform V1

DEPLOYMENT
1. Upload this entire folder to the GitHub repository connected to Vercel,
   or upload the ZIP to a new Vercel static project.
2. The root index.html remains the existing Supabase-connected advantage engine.
3. Existing root coach links remain in the form:
   https://YOUR-DOMAIN.vercel.app/?share=TOKEN

MODULES
- /                Offense advantage analytics and current team comparison tools
- /personnel/      Florida Atlantic player portal (offense and defense personnel)
- /defense/        Defense scheme analytics workspace shell

IMPORTANT
- Supabase URL and publishable key were preserved exactly from the supplied app.
- No environment variables are required for the current static build.
- No defensive scheme data was invented.
- Player data remains embedded in the current personnel portal for Florida Atlantic.
- Future work should move personnel records into Supabase tables for multi-team scaling.
