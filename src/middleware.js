export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dna/:path*',
    '/major-matching/:path*',
    '/minimum-keilmuan/:path*',
    '/modules/:path*',
    '/simulator/:path*'
  ]
};
