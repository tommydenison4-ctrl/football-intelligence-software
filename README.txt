ULM Football Analytics V2 - Deploy Ready

This version is a complete static site.

To test:
1. Open index.html in a browser.
2. Internet access is required because Supabase and CSV libraries load from CDN.

To deploy on Vercel:
1. Create a new GitHub repository.
2. Upload index.html.
3. Import the repository into Vercel.
4. Deploy. No build settings or environment variables are required for this version.
5. In Supabase Authentication > URL Configuration, add the Vercel URL as Site URL and Redirect URL.

The publishable Supabase key is embedded in the site. The secret key is not included.
