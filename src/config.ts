export const config = () => ({
  // upload
  upload: {
    root: '/uploads',
    post: process.env.UPLOAD_POST,
  },
  following: {
    take: 12,
  },
});
