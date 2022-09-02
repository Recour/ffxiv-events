// For production, process.env.NODE_ENV will be undefined.
const isDev = process.env.NODE_ENV === "development";

export default isDev;
