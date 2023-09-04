export function debounceFn(cb: any, delay: number) {
  let timer: any = null;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(arguments);
    }, delay);
  }
}