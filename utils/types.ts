export type lesson = {
  name: string,
  room: number
  periodic?: 'odd' | 'even'
}

export type day =  Array<lesson | null>