
export const aMax = (arr, cb) => {
  let max = null
  for (let item of arr) {
    if (max === null || (cb(item) > cb(max))) max = item
  }
  return max
}
