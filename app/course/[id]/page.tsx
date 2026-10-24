import { redirect } from 'next/navigation'

export default async function CourseAliasPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const sParams = await searchParams
  const query = new URLSearchParams()
  for (const [k, v] of Object.entries(sParams)) {
    if (typeof v === 'string') query.set(k, v)
  }
  const qs = query.toString() ? `?${query.toString()}` : ''
  redirect(`/library/${id}${qs}`)
}
