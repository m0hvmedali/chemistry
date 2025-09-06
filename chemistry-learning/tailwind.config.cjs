/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx,html}',
      // إذا كانت هنالك حزم/مسارات أخرى ضعها هنا
    ],
    theme: {
      extend: {
        colors: {
          // ربط أسماء الألوان بقيم متغيّرات CSS في index.css
          border: 'var(--border)',
          input: 'var(--input)',
          ring: 'var(--ring)',
          background: 'var(--background)',
          foreground: 'var(--foreground)',
          card: 'var(--card)',
          'card-foreground': 'var(--card-foreground)',
          popover: 'var(--popover)',
          'popover-foreground': 'var(--popover-foreground)',
          primary: 'var(--primary)',
          'primary-foreground': 'var(--primary-foreground)',
          secondary: 'var(--secondary)',
          'secondary-foreground': 'var(--secondary-foreground)',
          muted: 'var(--muted)',
          'muted-foreground': 'var(--muted-foreground)',
          accent: 'var(--accent)',
          'accent-foreground': 'var(--accent-foreground)',
          destructive: 'var(--destructive)',
        },
      },
    },
    plugins: [],
  };
  