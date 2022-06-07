import { writable } from "svelte/store";
import cryptoRandomString from "crypto-random-string";
import _find from "lodash/find";
import _remove from "lodash/remove";
import cloneDeep from "lodash/cloneDeep";

const crypto = () => cryptoRandomString({ length: 10 });
const repoLists = JSON.parse(window.localStorage.getItem("lists")) || [];

const _lists = writable(repoLists);

_lists.subscribe(($lists) => {
  window.localStorage.setItem("lists", JSON.stringify($lists));
});

export const lists = {
  subscribe: _lists.subscribe,
  add: (payload) => {
    const { title } = payload;
    _lists.update(($lists) => {
      $lists.push({
        id: crypto(),
        title,
        cards: [],
      });
      return $lists;
    });
  },
  edit: (payload) => {
    const { listId, title } = payload;
    _lists.update(($lists) => {
      // const foundList = $lists.find((l) => {
      //   return l.id === listId;
      // });
      const foundList = _find($lists, { id: listId });
      foundList.title = title;
      return $lists;
    });
  },
  remove: (paylod) => {
    const { listId } = paylod;
    _lists.update(($lists) => {
      _remove($lists, { id: listId });
      return $lists;
    });
  },
  reorder: (payload) => {
    const { oldIndex, newIndex } = payload;
    _lists.update(($lists) => {
      const clone = cloneDeep($lists[oldIndex]);
      $lists.splice(oldIndex, 1);
      $lists.splice(newIndex, 0, clone);
      return $lists;
    });
  },
};

export const cards = {
  add(payload) {
    const { listId, title } = payload;
    _lists.update(($lists) => {
      const foundList = _find($lists, { id: listId });
      foundList.cards.push({ id: crypto(), title });
      return $lists;
    });
  },
};
