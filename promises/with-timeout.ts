const withTimeout = <T>(promise: Promise<T>): [Promise<T | void>, NodeJS.Timeout] => {
  let timeoutId!: NodeJS.Timeout;
  const timeoutPromise = new Promise<void>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, 4000);
  });
  return [
    Promise.race([promise, timeoutPromise]),
    timeoutId
  ];
};

export default withTimeout;