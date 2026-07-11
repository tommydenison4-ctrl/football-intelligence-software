ULM Unified Football Analytics Platform V1.2 Flat

WHY THIS VERSION
The prior folder-based upload allowed the Player Portal index.html to replace the
root analytics index.html during deployment.

THIS PACKAGE IS FLAT:
- index.html             Original Supabase offense/advantage analytics engine
- personnel.html         Florida Atlantic Player Portal
- defense.html           Defense Scheme workspace
- personnel-app.js       Player Portal JavaScript
- personnel-data.js      Player Portal embedded FAU data
- personnel-styles.css   Player Portal styling
- ulm_logo_official.png  Shared logo

UPLOAD INSTRUCTIONS
1. Remove the currently uploaded merged files from the repository root, or replace them.
2. Upload ALL files from this ZIP directly into the repository root.
3. Confirm that index.html is the offense advantage analytics code before committing.
4. Vercel will deploy:
   /index.html
   /personnel.html
   /defense.html

EXISTING FUNCTIONALITY
- Supabase project login/import/share logic is preserved in index.html.
- Existing coach links remain rooted at:
  https://YOUR-DOMAIN/?share=TOKEN
- Player Portal remains static and uses the embedded Florida Atlantic dataset.
