export const normalizeAllUrls = data => {
  const stacktrace =
    data.exception && data.exception.length > 0 && data.exception[0].stacktrace;

  if (stacktrace && stacktrace.frames) {
    stacktrace.frames.forEach(frame => {
      if (frame.filename.startsWith('/')) {
        frame.filename = 'app:///' + frame.filename;
      }
    });
  }
  return data;
};
