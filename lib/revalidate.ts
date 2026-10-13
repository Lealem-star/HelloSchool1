import { revalidatePath } from 'next/cache'

export function revalidatePublicSite() {
  revalidatePath('/', 'layout')
}
