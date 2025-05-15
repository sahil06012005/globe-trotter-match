
// This is the main toast hook implementation
import * as React from "react"
import {
  type ToastActionElement,
  type ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 20
const TOAST_REMOVE_DELAY = 1000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

interface Toast extends Omit<ToasterToast, "id"> {
  id?: string
}

let listeners: Set<(action: Action) => void> = new Set()

function dispatch(action: Action) {
  if (listeners.size === 0) {
    console.error(
      "Toast dispatch called without any listeners. This is a no-op but indicates a potential issue in your code."
    )
    return
  }
  
  listeners.forEach((listener) => {
    listener(action)
  })
}

function createToast(props: Toast) {
  const id = props.id || genId()

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })
        }
      },
    },
  })

  return id
}

function updateToast(
  id: string,
  props: Partial<Omit<ToasterToast, "id">>
) {
  dispatch({
    type: actionTypes.UPDATE_TOAST,
    toast: { ...props, id },
  })
}

function dismissToast(toastId?: string) {
  dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
}

function removeToast(toastId?: string) {
  dispatch({ type: actionTypes.REMOVE_TOAST, toastId })
}

function useToast() {
  const [state, setState] = React.useState<State>({ toasts: [] })

  React.useEffect(() => {
    // Add listener when the hook is first called
    const listener = (action: Action) => {
      setState((prevState) => reducer(prevState, action))
    }
    
    listeners.add(listener)
    
    // Remove listener when the component unmounts
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return {
    ...state,
    toast: createToast,
    dismiss: dismissToast,
    remove: removeToast,
    update: updateToast,
  }
}

// Export the toast function directly
export const toast = (props: Toast) => createToast(props)

// Export the hook
export { useToast }
export type { Toast }
