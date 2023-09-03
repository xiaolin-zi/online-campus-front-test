// 节流
export function throttleFn(cb: any, wait: number) {
  let timeOut: any = null;
  return function() {
    if (!timeOut) {
      timeOut = setTimeout(() => {
        cb();
        timeOut = null;
      }, wait);
    }
  }
}