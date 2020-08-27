import { useEffect, useState } from 'react';
import uuid from 'uuid';
import { equals } from 'ramda';

export const replaceElement = <E>(array: E[], index: number, value: E): E[] => [
  ...array.slice(0, index),
  value,
  ...array.slice(index + 1),
];

export const changeElementAtIndex = <T>(
  array: T[],
  element: T,
  index: number
): T[] => array.map((el, i) => (i === index ? element : el));

export const removeElementByIndex = <E>(array: E[], index: number): E[] => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
];

export function addOrRemove<T>(element: T, list: T[]): T[] {
  return list.includes(element)
    ? list.filter((el) => el !== element)
    : [...list, element];
}
