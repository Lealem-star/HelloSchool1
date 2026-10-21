'use client'

import { useState } from 'react'
import {
  Printer,
  X,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Receipt,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { schoolConfig } from '@/lib/data'
import { useLanguage } from '@/components/language-provider'

export type ReceiptData = {
  receiptNumber: string
  studentName: string
  studentId: string
  courseTitle: string
  shift: string
  batchNumber?: string
  amountPaid: number
  paymentMethod: string
  paymentPlan: string
  transactionRef?: string | null
  receiptUrl?: string | null
  createdAt: string
  cashierName?: string
}

interface OfficialReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  data: ReceiptData
}

export function OfficialReceiptModal({ isOpen, onClose, data }: OfficialReceiptModalProps) {
  const { language } = useLanguage()
  const isAm = language === 'am'
  const [showAttachedSlip, setShowAttachedSlip] = useState(false)

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const formattedDate = new Date(data.createdAt).toLocaleDateString(isAm ? 'am-ET' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Container */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-none">
        
        {/* Top Control Bar (Hidden during printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-sky-400">
              <Receipt className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {isAm ? 'ይፋዊ የክፍያ ደረሰኝ' : 'Official Tuition Receipt'}
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono">
                #{data.receiptNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-500/20"
            >
              <Printer className="size-3.5" /> {isAm ? 'አትም / PDF አውርድ' : 'Print / Save PDF'}
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* ─── PRINTABLE RECEIPT BODY ─── */}
        <div id="printable-receipt" className="p-6 sm:p-10 bg-card text-foreground print:p-8 print:text-black print:bg-white">
          {/* Institution Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-border/80 print:border-neutral-300">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg">
                  HT
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-foreground print:text-black tracking-tight leading-tight">
                    {schoolConfig.name}
                  </h1>
                  <p className="text-xs font-bold text-blue-600 dark:text-sky-400 print:text-blue-800 uppercase tracking-wider">
                    {schoolConfig.englishName}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground print:text-neutral-600 max-w-sm leading-relaxed">
                {isAm ? schoolConfig.address : schoolConfig.englishAddress}
              </p>
            </div>

            <div className="sm:text-right text-xs space-y-1">
              <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 print:border-emerald-600 print:text-emerald-700">
                ✓ {isAm ? 'የተረጋገጠ ክፍያ' : 'Payment Verified'}
              </span>
              <p className="font-mono text-xs text-muted-foreground print:text-neutral-600 mt-1">
                <strong>{isAm ? 'ደረሰኝ ቁጥር፦' : 'Receipt No:'}</strong> {data.receiptNumber}
              </p>
              <p className="text-xs text-muted-foreground print:text-neutral-600">
                <strong>{isAm ? 'ቀን፦' : 'Date:'}</strong> {formattedDate}
              </p>
            </div>
          </div>

          {/* Student & Course Details Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border bg-muted/20 p-4 print:border-neutral-300 print:bg-neutral-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground print:text-neutral-500">
                {isAm ? 'የተማሪው መረጃ' : 'Student Information'}
              </span>
              <h4 className="mt-1 text-base font-bold text-foreground print:text-black">
                {data.studentName}
              </h4>
              <p className="mt-0.5 font-mono text-blue-600 dark:text-sky-400 print:text-blue-800 font-bold">
                {isAm ? 'መለያ ቁጥር፦' : 'ID:'} {data.studentId}
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4 print:border-neutral-300 print:bg-neutral-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground print:text-neutral-500">
                {isAm ? 'የተመዘገቡበት ስልጠና' : 'Enrolled Training Track'}
              </span>
              <h4 className="mt-1 text-base font-bold text-foreground print:text-black">
                {data.courseTitle}
              </h4>
              <p className="mt-0.5 text-muted-foreground print:text-neutral-600">
                {isAm ? 'ፈረቃ፦' : 'Shift:'} <strong>{data.shift}</strong> {data.batchNumber ? `· (${data.batchNumber})` : ''}
              </p>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="mt-6 rounded-2xl border overflow-hidden print:border-neutral-300">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b print:bg-neutral-100 print:border-neutral-300 text-muted-foreground print:text-neutral-700">
                <tr>
                  <th className="p-3.5 font-bold uppercase tracking-wider">
                    {isAm ? 'ዝርዝር ማብራሪያ' : 'Description'}
                  </th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">
                    {isAm ? 'የክፍያ ዕቅድ' : 'Payment Plan'}
                  </th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-right">
                    {isAm ? 'የተከፈለው መጠን' : 'Amount (ETB)'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 print:divide-neutral-200">
                <tr>
                  <td className="p-3.5">
                    <p className="font-bold text-foreground print:text-black">
                      {data.courseTitle} — {isAm ? 'ተግባራዊ የላብራቶሪ ስልጠና' : 'Accredited Practical Training'}
                    </p>
                    <p className="text-[11px] text-muted-foreground print:text-neutral-500 mt-0.5">
                      {isAm
                        ? 'የመሳሪያዎችና የሙከራ ላብራቶሪ አገልግሎት፣ የCOC ማዘጋጃ ፈተና እና ዲጂታል ላይብረሪ ጨምሮ'
                        : 'Includes hardware diagnostic tools, workshop workbench, COC readiness preparation & digital library access'}
                    </p>
                  </td>
                  <td className="p-3.5 text-muted-foreground print:text-neutral-700">
                    {data.paymentPlan}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-foreground print:text-black text-sm">
                    {data.amountPaid.toLocaleString()} ETB
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-blue-500/10 border-t print:bg-neutral-100 print:border-neutral-300">
                <tr>
                  <td colSpan={2} className="p-3.5 font-bold text-right text-foreground print:text-black">
                    {isAm ? 'ጠቅላላ የተከፈለ ሂሳብ (Total Paid):' : 'Total Amount Paid:'}
                  </td>
                  <td className="p-3.5 font-mono font-black text-right text-base text-blue-600 dark:text-sky-400 print:text-blue-900">
                    {data.amountPaid.toLocaleString()} Birr
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Method & Bank Reference */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border bg-muted/10 print:border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-muted-foreground print:text-neutral-500">
                {isAm ? 'የክፍያ መንገድ' : 'Payment Method'}
              </span>
              <p className="mt-0.5 font-bold text-foreground print:text-black">
                {data.paymentMethod}
              </p>
            </div>

            <div className="p-3 rounded-xl border bg-muted/10 print:border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-muted-foreground print:text-neutral-500">
                {isAm ? 'የግብይት መለያ (Txn Ref)' : 'Transaction Reference'}
              </span>
              <p className="mt-0.5 font-mono font-bold text-blue-600 dark:text-sky-400 print:text-blue-800 truncate">
                {data.transactionRef || (isAm ? 'የተረጋገጠ' : 'Verified')}
              </p>
            </div>

            <div className="p-3 rounded-xl border bg-muted/10 col-span-2 sm:col-span-1 print:border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-muted-foreground print:text-neutral-500">
                {isAm ? 'የማረጋገጫ ሁኔታ' : 'Status'}
              </span>
              <p className="mt-0.5 font-bold text-emerald-600 dark:text-emerald-400 print:text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> {isAm ? 'ይፋዊ ክፍያ' : 'Official Paid'}
              </p>
            </div>
          </div>

          {/* Institutional Signoff & Stamp Box */}
          <div className="mt-8 pt-6 border-t border-border/80 print:border-neutral-300 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
            <div className="text-[11px] text-muted-foreground print:text-neutral-500 max-w-sm space-y-1">
              <p className="flex items-center gap-1.5 font-bold text-foreground print:text-black">
                <ShieldCheck className="size-3.5 text-blue-600" />
                {isAm ? 'ይፋዊ የትምህርት ማዕከል ማረጋገጫ' : 'Institutional Accreditation Notice'}
              </p>
              <p>
                {isAm
                  ? 'ይህ ሰነድ በሄሎ ቴክኖሎጂ ማሰልጠኛ ማዕከል የተዘጋጀ ይፋዊ የክፍያ ማረጋገጫ ነው። ለተጨማሪ ማብራሪያ በ 09 47 74 70 70 ያነጋግሩን።'
                  : 'This computer-generated receipt serves as official proof of fee settlement for Hello Technology Training Center vocational cohort admission.'}
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block p-4 border border-dashed rounded-2xl border-blue-500/40 bg-blue-500/5 text-center min-w-[180px] print:border-neutral-400 print:bg-white">
                <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-sky-400 print:text-blue-900 tracking-wider">
                  {schoolConfig.name}
                </div>
                <div className="my-2 border-b border-border/60 print:border-neutral-300 w-24 mx-auto" />
                <p className="font-serif italic text-xs text-foreground print:text-black font-semibold">
                  {data.cashierName || 'Finance & Admissions'}
                </p>
                <span className="text-[9px] text-muted-foreground print:text-neutral-500 uppercase tracking-widest block mt-0.5">
                  {isAm ? 'የፋይናንስ ክፍል ፊርማ' : 'Finance Desk Signoff'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Attached Original Bank Slip Section (if available) */}
        {data.receiptUrl && (
          <div className="border-t bg-muted/20 p-4 px-6 print:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-foreground">
                  {isAm ? 'የተያያዘ የባንክ ደረሰኝ ቅጅ፦' : 'Attached Bank Slip Copy:'}
                </span>
                <span className="font-mono text-muted-foreground text-[11px] truncate max-w-xs">
                  {data.receiptUrl.split('/').pop()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAttachedSlip(!showAttachedSlip)}
                  className="rounded-xl text-xs"
                >
                  {showAttachedSlip
                    ? (isAm ? 'ቅጁን ደብቅ' : 'Hide Slip')
                    : (isAm ? 'ቅጁን አሳይ' : 'Preview Slip')}
                </Button>
                <a href={data.receiptUrl} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="sm" className="rounded-xl text-xs gap-1">
                    <ExternalLink className="size-3.5" /> {isAm ? 'ክፈት' : 'Open'}
                  </Button>
                </a>
              </div>
            </div>

            {showAttachedSlip && (
              <div className="mt-3 rounded-2xl border p-2 bg-background overflow-hidden flex justify-center">
                <img
                  src={data.receiptUrl}
                  alt="Original Bank Receipt"
                  className="max-h-72 rounded-xl object-contain shadow"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
