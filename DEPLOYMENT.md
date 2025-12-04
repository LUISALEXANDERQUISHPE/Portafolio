# Deployment Guide

This portfolio is optimized for deployment on Vercel. Follow these steps to deploy your portfolio.

## Prerequisites

- Node.js 18+ installed
- Git repository initialized
- GitHub account (for Vercel integration)

## Deployment Steps

### 1. Prepare Your Environment

Copy the `.env.example` file to `.env.local` and update the values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update the following in `.env.local`:
- `NEXT_PUBLIC_SITE_URL`: Your portfolio's public URL

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Follow the prompts to connect your project and deploy.

#### Option B: Using GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js and configure the build settings
6. Click "Deploy"

### 3. Configure Custom Domain

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### 4. Update Metadata

Before deploying, update the following in `app/layout.tsx`:
- Replace "Your Name" with your actual name
- Update the portfolio URL from `https://yourportfolio.com` to your actual domain
- Update social media links in `components/footer.tsx`
- Update contact information in `components/sections/contact.tsx`

### 5. Add Optional Features

#### Email Integration (EmailJS)

1. Sign up at [emailjs.com](https://emailjs.com)
2. Create a service and template
3. Add the credentials to your `.env.local`:
   \`\`\`
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   \`\`\`

#### Google Analytics

1. Set up a property in [Google Analytics](https://analytics.google.com)
2. Add your Measurement ID to `.env.local`:
   \`\`\`
   NEXT_PUBLIC_GA_ID=your_measurement_id
   \`\`\`

## Performance Optimization

The portfolio includes several optimizations:

- **Image Optimization**: Next.js automatically optimizes images
- **Code Splitting**: Automatic code splitting for faster page loads
- **Caching**: Configured for optimal caching strategies
- **SEO**: Structured data and meta tags for better search engine visibility

## Security Headers

The `vercel.json` file includes security headers:

- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Enables XSS protection
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

## Monitoring

After deployment, monitor your site using:

- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics**: Track user behavior
- **Lighthouse**: Run audits for performance, accessibility, and SEO

## Troubleshooting

### Build Fails

1. Check the build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Verify Node.js version compatibility

### Slow Performance

1. Check Vercel Analytics for bottlenecks
2. Optimize images in the `public` folder
3. Review bundle size with `npm run build`

### SEO Issues

1. Verify `robots.txt` and `sitemap.xml` are accessible
2. Check Google Search Console for indexing issues
3. Validate structured data with [Schema.org validator](https://validator.schema.org)

## Support

For more information, visit:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
