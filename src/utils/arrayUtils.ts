export default class ArrayUtils {
  public static toMap<TKey, TValue>(source: Array<TValue>, keySelctor: (item: TValue) => TKey): Map<TKey, TValue> {
    let map = new Map<TKey, TValue>();
    source.forEach(element => {
      let key = keySelctor(element);
      map.set(key, element);
    });
    return map;
  }

  public static toMapResult<TKey, TValue, TSource>(
    source: Array<TSource>,
    keySelctor: (item: TSource) => TKey,
    valueSelctor: (key: TKey, item: TSource) => TValue
  ): Map<TKey, TValue> {
    let map = new Map<TKey, TValue>();
    source.forEach(element => {
      let key = keySelctor(element);
      let value = valueSelctor(key, element);
      map.set(key, value);
    });
    return map;
  }

  public static toSet<TSource, TValue>(source: Array<TSource>, keySelctor: (item: TSource) => TValue): Set<TValue> {
    let map = new Set<TValue>();
    source.forEach(element => {
      let value = keySelctor(element);
      map.add(value);
    });
    return map;
  }
}
