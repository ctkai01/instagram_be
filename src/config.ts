export const config = () => ({
  // upload
  upload: {
    root: '/uploads',
    post: process.env.UPLOAD_POST,
  },
  follow: {
    take: 12,
  },
});
