import { Person } from "shared/models/person"

export function ascending(data: { students: Person[] }, key: keyof Person): { students: Person[] } {
  const newData = { ...data }
  if (key === "first_name" || key === "last_name") {
    newData.students.sort((a, b) => {
      if (a[key] > b[key]) {
        return -1
      } else {
        return 1
      }
    })
  }
  return newData
}

export function descending(data: { students: Person[] }, key: keyof Person): { students: Person[] } {
  const newData = { ...data }
  if (key === "first_name" || key === "last_name") {
    newData.students.sort((a, b) => {
      if (a[key] > b[key]) {
        return 1
      } else {
        return -1
      }
    })
  }
  return newData
}

export const debounce = <T extends (...args: any[]) => ReturnType<T>>(callback: T, timeout: number): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback(...args)
    }, timeout)
  }
}
