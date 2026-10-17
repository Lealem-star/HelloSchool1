'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Info,
  Trash2,
  X,
} from 'lucide-react'
import { Button } from './button'

export type DialogVariant = 'danger' | 'warning' | 'info' | 'success'

export type ConfirmOptions = {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: DialogVariant
}

export type AlertOptions = {
  title?: string
  message: string
  buttonText?: string
  variant?: DialogVariant
}

type DialogState = {
  isOpen: boolean
  type: 'confirm' | 'alert'
  title: string
  message: string
  confirmText: string
  cancelText: string
  variant: DialogVariant
}

type DialogContextType = {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>
  alert: (options: AlertOptions | string) => Promise<void>
}

const DialogContext = createContext<DialogContextType | null>(null)

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'info',
  })

  const resolverRef = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((options: ConfirmOptions | string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve

      if (typeof options === 'string') {
        const isDelete = options.toLowerCase().includes('delete') || options.toLowerCase().includes('remove')
        setDialog({
          isOpen: true,
          type: 'confirm',
          title: isDelete ? 'Confirm Deletion' : 'Confirm Action',
          message: options,
          confirmText: isDelete ? 'Delete' : 'Confirm',
          cancelText: 'Cancel',
          variant: isDelete ? 'danger' : 'info',
        })
      } else {
        setDialog({
          isOpen: true,
          type: 'confirm',
          title: options.title || (options.variant === 'danger' ? 'Confirm Deletion' : 'Confirmation'),
          message: options.message,
          confirmText: options.confirmText || (options.variant === 'danger' ? 'Delete' : 'Confirm'),
          cancelText: options.cancelText || 'Cancel',
          variant: options.variant || 'info',
        })
      }
    })
  }, [])

  const alert = useCallback((options: AlertOptions | string): Promise<void> => {
    return new Promise<void>((resolve) => {
      resolverRef.current = () => resolve()

      if (typeof options === 'string') {
        setDialog({
          isOpen: true,
          type: 'alert',
          title: 'Notice',
          message: options,
          confirmText: 'Understood',
          cancelText: '',
          variant: 'info',
        })
      } else {
        setDialog({
          isOpen: true,
          type: 'alert',
          title: options.title || 'Notice',
          message: options.message,
          confirmText: options.buttonText || 'Understood',
          cancelText: '',
          variant: options.variant || 'info',
        })
      }
    })
  }, [])

  const handleConfirm = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }))
    if (resolverRef.current) {
      resolverRef.current(true)
      resolverRef.current = null
    }
  }

  const handleCancel = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }))
    if (resolverRef.current) {
      resolverRef.current(false)
      resolverRef.current = null
    }
  }

  const getVariantIcon = () => {
    switch (dialog.variant) {
      case 'danger':
        return (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm">
            <Trash2 className="size-6" />
          </div>
        )
      case 'warning':
        return (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm">
            <AlertTriangle className="size-6" />
          </div>
        )
      case 'success':
        return (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <CheckCircle2 className="size-6" />
          </div>
        )
      case 'info':
      default:
        return (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/25 bg-blue-500/10 text-[#155DFC] shadow-sm">
            <HelpCircle className="size-6" />
          </div>
        )
    }
  }

  const getConfirmButtonStyles = () => {
    switch (dialog.variant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-500/20'
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-500/20'
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20'
      case 'info':
      default:
        return 'bg-[#155DFC] hover:bg-[#0D4ECC] text-white font-bold shadow-md shadow-blue-500/25'
    }
  }

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}

      {/* ── MODAL DIALOG CARD ── */}
      {dialog.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-md animate-fade-in"
          onClick={handleCancel}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-card text-slate-900 dark:text-white animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={handleCancel}
              className="absolute right-4.5 top-4.5 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
              aria-label="Close dialog"
            >
              <X className="size-4.5" />
            </button>

            {/* Header with Icon and Title */}
            <div className="flex items-start gap-4">
              {getVariantIcon()}
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  {dialog.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
                  {dialog.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
              {dialog.type === 'confirm' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="rounded-xl border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {dialog.cancelText}
                </Button>
              )}
              <Button
                type="button"
                onClick={handleConfirm}
                className={`rounded-xl px-5 py-2 text-xs sm:text-sm ${getConfirmButtonStyles()}`}
              >
                {dialog.confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(DialogContext)
  if (!ctx) {
    throw new Error('useConfirm must be used within a DialogProvider')
  }
  return ctx
}
