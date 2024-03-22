export const createObj = <T extends string, V>(keys: T[], value: (key: T) => V): Record<T, V> => {
    return keys.reduce((obj, key) => ({
        ...obj,
        [key]: value(key),
    }), {} as Record<T, V>)
}

export const createKeyList = <T extends Record<string, any>>(obj: T, filter: (key: keyof T, value: T[keyof T]) => boolean) => {
    return Object.keys(obj).reduce((list, key) => {
        if (filter(key, obj[key])) list.push(key)
        return list
    }, [] as (keyof T)[])
}

export const keyof = <K extends string>(obj: Record<K, any>): K[] => <K[]>Object.keys(obj)
