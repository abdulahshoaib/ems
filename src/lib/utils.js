import { useEffect, useRef, useState } from "react";

export function cn(...inputs) {
  return inputs.flat().filter(Boolean).join(" ");
}

export function useLatest(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}

export function useControllableState({ value, defaultValue, onChange }) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = isControlled ? value : uncontrolled;

  const stateRef = useLatest(current);
  const onChangeRef = useLatest(onChange);

  const setValue = (next) => {
    const resolved = typeof next === "function" ? next(stateRef.current) : next;
    if (!isControlled) setUncontrolled(resolved);
    onChangeRef.current?.(resolved);
  };

  return [current, setValue];
}

export function useClickOutside(ref, handler, enabled = true) {
  const handlerRef = useLatest(handler);

  useEffect(() => {
    if (!enabled) return undefined;

    function handlePointerDown(event) {
      const element = ref.current;
      if (!element || element.contains(event.target)) return;
      handlerRef.current(event);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [ref, handlerRef, enabled]);
}

export function useEscapeKey(handler, enabled = true) {
  const handlerRef = useLatest(handler);

  useEffect(() => {
    if (!enabled) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") handlerRef.current(event);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlerRef, enabled]);
}
