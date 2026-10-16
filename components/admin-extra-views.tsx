'use client'

import { useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  X,
  GraduationCap,
  Wrench,
  Cpu,
  CheckCircle2,
  ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export type AdminInstructor = {
  id: string
  name: string
  role: string
  experience: string | null
  bio: string | null
  specialties: string[]
  image: string | null
  published: boolean
  sortOrder: number
}

export type AdminFacility = {
  id: string
  title: string
  description: string | null
  icon: string | null
  image: string | null
  published: boolean
  sortOrder: number
}

export type AdminStudentProject = {
  id: string
  title: string
  category: string | null
  device: string | null
  fault: string | null
  diagnosticProcess: string | null
  solution: string | null
  outcome: string | null
  technician: string | null
  badge: string | null
  image: string | null
  published: boolean
  sortOrder: number
}

function Modal({
  open,
  onClose,
  title,
  children,
  width = 'max-w-2xl',
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: string
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${width} my-8 rounded-3xl border bg-card shadow-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/40">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}

const inputCls =
  'h-11 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500'
const textareaCls =
  'rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500'

function toSpecialtiesArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String)
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val)
      if (Array.isArray(parsed)) return parsed.map(String)
    } catch {
      return val.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

/* ──────────────────────────────────────────────────────────────
   1. INSTRUCTORS VIEW & MODAL
   ────────────────────────────────────────────────────────────── */
export function InstructorsView({
  items,
  loading,
  search,
  setSearch,
  onAdd,
  onEdit,
  onDelete,
  savingId,
}: {
  items: AdminInstructor[]
  loading: boolean
  search: string
  setSearch: (v: string) => void
  onAdd: () => void
  onEdit: (item: AdminInstructor) => void
  onDelete: (id: string) => void
  savingId: string | null
}) {
  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.role.toLowerCase().includes(search.toLowerCase()) ||
      (i.bio && i.bio.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Instructors & Mentors</h2>
          <p className="text-sm text-muted-foreground">Manage training faculty displayed on About page</p>
        </div>
        <Button onClick={onAdd} className="bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400">
          <Plus className="mr-1.5 size-4" /> Add Instructor
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search instructors by name, title, or bio..."
          className="h-10 w-full max-w-sm rounded-xl border bg-card pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-cyan-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          No instructors found. Click "Add Instructor" to create one.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((inst) => (
            <div
              key={inst.id}
              className="flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm transition hover:border-cyan-500/40"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={inst.image || '/images/helloschool.jpg'}
                    alt={inst.name}
                    className="size-16 rounded-xl border object-cover shrink-0"
                    onError={(e) => ((e.target as any).src = '/images/helloschool.jpg')}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-md bg-cyan-400/10 px-2 py-0.5 text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                      {inst.experience || 'Specialist'}
                    </span>
                    <h3 className="mt-1 truncate font-bold text-foreground">{inst.name}</h3>
                    <p className="text-xs text-muted-foreground">{inst.role}</p>
                  </div>
                </div>

                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {inst.bio || 'No bio provided.'}
                </p>

                {(() => {
                  const specs = toSpecialtiesArray(inst.specialties)
                  if (specs.length === 0) return null
                  return (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {specs.slice(0, 3).map((s) => (
                        <span key={s} className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                          {s}
                        </span>
                      ))}
                      {specs.length > 3 && (
                        <span className="text-[10px] text-muted-foreground self-center">
                          +{specs.length - 3} more
                        </span>
                      )}
                    </div>
                  )
                })()}
              </div>

              <div className="mt-5 flex items-center justify-between border-t pt-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    inst.published
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {inst.published ? 'Published' : 'Hidden'}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(inst)} className="h-8 px-2">
                    <Pencil className="size-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(inst.id)}
                    disabled={savingId === inst.id}
                    className="h-8 px-2 text-rose-500 hover:text-rose-600"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function InstructorModal({
  open,
  onClose,
  instructor,
  onSave,
}: {
  open: boolean
  onClose: () => void
  instructor: AdminInstructor | null
  onSave: (data: Partial<AdminInstructor>) => Promise<void>
}) {
  const [name, setName] = useState(instructor?.name || '')
  const [role, setRole] = useState(instructor?.role || '')
  const [experience, setExperience] = useState(instructor?.experience || '')
  const [bio, setBio] = useState(instructor?.bio || '')
  const [specialties, setSpecialties] = useState(
    toSpecialtiesArray(instructor?.specialties).join(', ')
  )
  const [image, setImage] = useState(instructor?.image || '')
  const [published, setPublished] = useState(instructor ? instructor.published : true)
  const [sortOrder, setSortOrder] = useState(instructor ? instructor.sortOrder : 0)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !role.trim()) return alert('Name and role are required')
    setSaving(true)
    try {
      const parsedSpecialties = specialties
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      await onSave({
        id: instructor?.id,
        name: name.trim(),
        role: role.trim(),
        experience: experience.trim() || null,
        bio: bio.trim() || null,
        specialties: parsedSpecialties,
        image: image.trim() || null,
        published,
        sortOrder,
      })
      onClose()
    } catch (err: any) {
      alert(err.message || 'Failed to save instructor')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={instructor ? 'Edit Instructor' : 'Add New Instructor'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
            Full Name *
            <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
            Role / Title *
            <input value={role} onChange={(e) => setRole(e.target.value)} required className={inputCls} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
            Experience Label (e.g. "12+ Years Experience")
            <input value={experience} onChange={(e) => setExperience(e.target.value)} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
            Sort Order
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              className={inputCls}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
          Profile Photo URL
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
          Core Specialties (comma separated)
          <input
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            placeholder="Micro-soldering, SMD Diagnostics, Thermal Imaging"
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
          Biography
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Background, certifications, workbench mastery..."
            className={textareaCls}
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 rounded accent-cyan-500"
          />
          Published (visible on website)
        </label>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400">
            {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            {saving ? 'Saving...' : instructor ? 'Update Instructor' : 'Create Instructor'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

/* ──────────────────────────────────────────────────────────────
   2. WORKSHOP FACILITIES VIEW & MODAL
   ────────────────────────────────────────────────────────────── */
export function FacilitiesView({
  items,
  loading,
  search,
  setSearch,
  onAdd,
  onEdit,
  onDelete,
  savingId,
}: {
  items: AdminFacility[]
  loading: boolean
  search: string
  setSearch: (v: string) => void
  onAdd: () => void
  onEdit: (item: AdminFacility) => void
  onDelete: (id: string) => void
  savingId: string | null
}) {
  const filtered = items.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Workshop Facilities</h2>
          <p className="text-sm text-muted-foreground">Manage workbench stations & equipment shown on Training page</p>
        </div>
        <Button onClick={onAdd} className="bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400">
          <Plus className="mr-1.5 size-4" /> Add Facility
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search workshop facilities..."
          className="h-10 w-full max-w-sm rounded-xl border bg-card pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-cyan-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          No workshop facilities found. Click "Add Facility" to create one.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((fac) => (
            <div
              key={fac.id}
              className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition hover:border-cyan-500/40"
            >
              <div>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
                  <Wrench className="size-5" />
                </div>
                <h3 className="mt-4 font-bold text-foreground">{fac.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {fac.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    fac.published
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {fac.published ? 'Live' : 'Hidden'}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(fac)} className="h-8 px-2">
                    <Pencil className="size-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(fac.id)}
                    disabled={savingId === fac.id}
                    className="h-8 px-2 text-rose-500 hover:text-rose-600"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function FacilityModal({
  open,
  onClose,
  facility,
  onSave,
}: {
  open: boolean
  onClose: () => void
  facility: AdminFacility | null
  onSave: (data: Partial<AdminFacility>) => Promise<void>
}) {
  const [title, setTitle] = useState(facility?.title || '')
  const [description, setDescription] = useState(facility?.description || '')
  const [icon, setIcon] = useState(facility?.icon || 'Wrench')
  const [sortOrder, setSortOrder] = useState(facility ? facility.sortOrder : 0)
  const [published, setPublished] = useState(facility ? facility.published : true)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return alert('Title is required')
    setSaving(true)
    try {
      await onSave({
        id: facility?.id,
        title: title.trim(),
        description: description.trim() || null,
        icon: icon.trim() || 'Wrench',
        sortOrder,
        published,
      })
      onClose()
    } catch (err: any) {
      alert(err.message || 'Failed to save facility')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={facility ? 'Edit Workshop Facility' : 'Add Workshop Facility'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
          Facility Title *
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
            Icon Identifier (e.g. Wrench, Cpu, Zap, Microscope)
            <input value={icon} onChange={(e) => setIcon(e.target.value)} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
            Sort Order
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              className={inputCls}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
          Description
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={textareaCls}
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 rounded accent-cyan-500"
          />
          Published (visible on website)
        </label>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400">
            {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            {saving ? 'Saving...' : facility ? 'Update Facility' : 'Create Facility'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

/* ──────────────────────────────────────────────────────────────
   3. STUDENT PROJECTS VIEW & MODAL
   ────────────────────────────────────────────────────────────── */
export function ProjectsView({
  items,
  loading,
  search,
  setSearch,
  onAdd,
  onEdit,
  onDelete,
  savingId,
}: {
  items: AdminStudentProject[]
  loading: boolean
  search: string
  setSearch: (v: string) => void
  onAdd: () => void
  onEdit: (item: AdminStudentProject) => void
  onDelete: (id: string) => void
  savingId: string | null
}) {
  const filtered = items.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.device && p.device.toLowerCase().includes(search.toLowerCase())) ||
      (p.technician && p.technician.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Student Projects & Case Studies</h2>
          <p className="text-sm text-muted-foreground">Manage real-world board repair cases displayed on Training page</p>
        </div>
        <Button onClick={onAdd} className="bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400">
          <Plus className="mr-1.5 size-4" /> Add Project Case
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects by device, fault, or technician..."
          className="h-10 w-full max-w-sm rounded-xl border bg-card pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-cyan-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          No student projects found. Click "Add Project Case" to create one.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition hover:border-cyan-500/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                    {proj.badge || 'Case Study'}
                  </span>
                  <span className="text-xs text-muted-foreground">{proj.category}</span>
                </div>

                <h3 className="mt-3 font-bold text-foreground">{proj.title}</h3>
                <p className="mt-1 text-xs font-medium text-cyan-600 dark:text-cyan-400">Device: {proj.device}</p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="rounded-lg bg-muted/60 p-2.5">
                    <span className="font-bold text-rose-500 block">Symptom</span>
                    <span className="text-muted-foreground line-clamp-2">{proj.fault}</span>
                  </div>
                  <div className="rounded-lg bg-muted/60 p-2.5">
                    <span className="font-bold text-emerald-500 block">Solution</span>
                    <span className="text-muted-foreground line-clamp-2">{proj.solution}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-3">
                <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[120px]">
                  {proj.technician}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(proj)} className="h-8 px-2">
                    <Pencil className="size-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(proj.id)}
                    disabled={savingId === proj.id}
                    className="h-8 px-2 text-rose-500 hover:text-rose-600"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectModal({
  open,
  onClose,
  project,
  onSave,
}: {
  open: boolean
  onClose: () => void
  project: AdminStudentProject | null
  onSave: (data: Partial<AdminStudentProject>) => Promise<void>
}) {
  const [title, setTitle] = useState(project?.title || '')
  const [category, setCategory] = useState(project?.category || 'Mobile Repair')
  const [device, setDevice] = useState(project?.device || '')
  const [badge, setBadge] = useState(project?.badge || 'Micro-Soldering Case')
  const [technician, setTechnician] = useState(project?.technician || '')
  const [fault, setFault] = useState(project?.fault || '')
  const [diagnosticProcess, setDiagnosticProcess] = useState(project?.diagnosticProcess || '')
  const [solution, setSolution] = useState(project?.solution || '')
  const [outcome, setOutcome] = useState(project?.outcome || '')
  const [sortOrder, setSortOrder] = useState(project ? project.sortOrder : 0)
  const [published, setPublished] = useState(project ? project.published : true)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return alert('Title is required')
    setSaving(true)
    try {
      await onSave({
        id: project?.id,
        title: title.trim(),
        category: category.trim() || null,
        device: device.trim() || null,
        badge: badge.trim() || null,
        technician: technician.trim() || null,
        fault: fault.trim() || null,
        diagnosticProcess: diagnosticProcess.trim() || null,
        solution: solution.trim() || null,
        outcome: outcome.trim() || null,
        sortOrder,
        published,
      })
      onClose()
    } catch (err: any) {
      alert(err.message || 'Failed to save student project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={project ? 'Edit Project Case' : 'Add Project Case'} width="max-w-3xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
          Project Case Title *
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
            Category
            <input value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
            Device Model (e.g. iPhone 13)
            <input value={device} onChange={(e) => setDevice(e.target.value)} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
            Badge (e.g. Micro-Soldering Case)
            <input value={badge} onChange={(e) => setBadge(e.target.value)} className={inputCls} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
            Technician / Trainee Name
            <input value={technician} onChange={(e) => setTechnician(e.target.value)} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
            Sort Order
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              className={inputCls}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
          Reported Symptom / Fault
          <textarea rows={2} value={fault} onChange={(e) => setFault(e.target.value)} className={textareaCls} />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
          Diagnostic Process
          <textarea
            rows={2}
            value={diagnosticProcess}
            onChange={(e) => setDiagnosticProcess(e.target.value)}
            className={textareaCls}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
          Workbench Solution
          <textarea rows={2} value={solution} onChange={(e) => setSolution(e.target.value)} className={textareaCls} />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-foreground">
          Outcome & Testing Result
          <textarea rows={2} value={outcome} onChange={(e) => setOutcome(e.target.value)} className={textareaCls} />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 rounded accent-cyan-500"
          />
          Published (visible on website)
        </label>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400">
            {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            {saving ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
