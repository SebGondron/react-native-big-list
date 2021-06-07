import { BigListItemType } from "./BigListItem";
import { forEachObjIndexed } from "./utils";

class BigListItemRecycler {
  static lastKey = 0;
  /**
   * Constructor.
   * @param items
   */
  constructor(items) {
    this.items = {};
    this.pendingItems = {};
    items.forEach((item) => {
      const { type, section, row } = item;
      const [itemsForType] = this.itemsForType(type);
      itemsForType[`${type}:${section}:${row}`] = item;
    });
  }

  /**
   * Items for type.
   * @param type
   * @returns {(*|{}|*[])[]}
   */
  itemsForType(type) {
    return [
      this.items[type] || (this.items[type] = {}),
      this.pendingItems[type] || (this.pendingItems[type] = []),
    ];
  }

  /**
   * Get item.
   * @param type
   * @param position
   * @param height
   * @param section
   * @param row
   * @returns {{section: number, position, row: number, type, key: number, height}}
   */
  get(type, position, height, section = 0, row = 0) {
    const [items, pendingItems] = this.itemsForType(type);
    const itemKey = `${type}:${section}:${row}`;
    let item = items[itemKey];
    if (item == null) {
      item = { type, key: -1, position, height, section, row };
      pendingItems.push(item);
    } else {
      item.position = position;
      item.height = height;
      delete items[itemKey];
    }
    return item;
  }

  /**
   * Fill.
   */
  fill() {
    forEachObjIndexed((type) => {
      const [items, pendingItems] = this.itemsForType(type);
      let index = 0;
      forEachObjIndexed(({ key }) => {
        const item = pendingItems[index];
        if (item == null) {
          return false;
        }
        item.key = key;
        index++;
      }, items);
      for (; index < pendingItems.length; index++) {
        pendingItems[index].key = ++BigListItemRecycler.lastKey;
      }
      pendingItems.length = 0;
    }, BigListItemType);
  }
}
export default BigListItemRecycler;