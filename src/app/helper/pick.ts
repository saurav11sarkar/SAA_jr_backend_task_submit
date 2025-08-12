const pick = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
  ) => {
    const finalObj = {} as Partial<T>;
    for (const key of keys) {
      if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
        finalObj[key] = obj[key];
      }
    }
    return finalObj;
  };
  
  export default pick;
  