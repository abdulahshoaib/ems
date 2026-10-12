import { useMemo, useState } from 'react'
import { Avatar } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { ErrorState } from '../../components/ui/empty-state'
import { Section } from '../../components/ui/section'
import { CheckCircleIcon, MailIcon, MapPinIcon, PhoneIcon, UsersIcon } from '../../components/ui/icons'
import { deriveSummary } from '../../data/selectors'
import { useDashboardData } from '../../hooks/useDashboardData'
import { formatMonthYear } from '../../lib/dates'

function toFormValues(user) {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone ?? '',
    location: user.location ?? '',
    bio: user.bio ?? '',
  }
}

function Field({ id, label, hint, ...inputProps }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[12.5px] font-medium text-[var(--d-text)]">
        {label}
      </label>
      <input
        id={id}
        className="d-focus h-8 w-full rounded-md border border-[var(--d-line)] bg-[var(--d-surface)] px-2.5 text-[13px] text-[var(--d-text)] placeholder:text-[var(--d-subtle)]"
        {...inputProps}
      />
      {hint && <p className="text-[11.5px] text-[var(--d-subtle)]">{hint}</p>}
    </div>
  )
}

/**
 * Rendered only once a user is available, so the form can seed its state from
 * props. The parent mounts it with `key={user.id}`; the saved values it diffs
 * against always come from the current user prop.
 */
function ProfileForm({ user, onSave }) {
  const [form, setForm] = useState(() => toFormValues(user))
  const [justSaved, setJustSaved] = useState(false)

  const savedValues = toFormValues(user)
  const isDirty = Object.keys(savedValues).some((key) => savedValues[key] !== form[key])

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }))
    setJustSaved(false)
  }

  function handleSubmit(submitEvent) {
    submitEvent.preventDefault()
    onSave({ ...form })
    setJustSaved(true)
  }

  function handleReset() {
    setForm(savedValues)
    setJustSaved(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          id="profile-name"
          label="Full name"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={(changeEvent) => updateField('name', changeEvent.target.value)}
        />
        <Field
          id="profile-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(changeEvent) => updateField('email', changeEvent.target.value)}
        />
        <Field
          id="profile-phone"
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(changeEvent) => updateField('phone', changeEvent.target.value)}
        />
        <Field
          id="profile-location"
          label="Location"
          name="location"
          autoComplete="address-level2"
          value={form.location}
          onChange={(changeEvent) => updateField('location', changeEvent.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="profile-bio" className="text-[12.5px] font-medium text-[var(--d-text)]">
          Bio
        </label>
        <textarea
          id="profile-bio"
          name="bio"
          rows={3}
          value={form.bio}
          onChange={(changeEvent) => updateField('bio', changeEvent.target.value)}
          className="d-focus w-full resize-y rounded-md border border-[var(--d-line)] bg-[var(--d-surface)] px-2.5 py-2 text-[13px] text-[var(--d-text)] placeholder:text-[var(--d-subtle)]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" disabled={!isDirty}>
          Save changes
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={handleReset} disabled={!isDirty}>
          Reset
        </Button>
        {justSaved && !isDirty && (
          <p
            role="status"
            className="flex items-center gap-1.5 text-[12.5px] text-[var(--d-ok)]"
          >
            <CheckCircleIcon className="h-3.5 w-3.5" />
            Profile updated
          </p>
        )}
      </div>

      <p className="text-[11.5px] text-[var(--d-subtle)]">
        Edits are held in memory for this demo. Persistence arrives with the accounts service.
      </p>
    </form>
  )
}

export function Profile() {
  const { status, error, data, retry, updateProfile } = useDashboardData()
  const user = data?.user ?? null

  const summary = useMemo(
    () => (data ? deriveSummary(data.events, data.registrations) : null),
    [data],
  )

  if (status === 'error') {
    return (
      <ErrorState
        title="We couldn't load your profile"
        description={error?.message ?? 'The data service did not respond. Please try again.'}
        onRetry={retry}
      />
    )
  }

  if (status === 'loading' || !user || !summary) {
    return <div className="h-40 animate-pulse rounded-md bg-white/[0.04]" />
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <Avatar name={user.name} src={user.avatarUrl} size="xl" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2>{user.name}</h2>
            <p className="text-[12.5px] text-[var(--d-muted)]">{user.role}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-[var(--d-muted)]">
            <span className="flex items-center gap-1.5">
              <MailIcon className="h-3.5 w-3.5 text-[var(--d-subtle)]" />
              {user.email}
            </span>
            {user.phone && (
              <span className="flex items-center gap-1.5">
                <PhoneIcon className="h-3.5 w-3.5 text-[var(--d-subtle)]" />
                {user.phone}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-3.5 w-3.5 text-[var(--d-subtle)]" />
                {user.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <UsersIcon className="h-3.5 w-3.5 text-[var(--d-subtle)]" />
              Joined {formatMonthYear(user.memberSince)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px] text-[var(--d-muted)]">
            <span>
              <span className="font-semibold text-[var(--d-text)]">{summary.registered}</span>{' '}
              registered
            </span>
            <span>
              <span className="font-semibold text-[var(--d-text)]">{summary.upcoming}</span> upcoming
            </span>
            <span>
              <span className="font-semibold text-[var(--d-text)]">{summary.completed}</span>{' '}
              completed
            </span>
          </div>
          {user.interests?.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {user.interests.map((interest) => (
                <li key={interest}>
                  <Badge>{interest}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="h-px w-full bg-[var(--d-line)]" />

      <Section title="Edit profile">
        <ProfileForm key={user.id} user={user} onSave={updateProfile} />
      </Section>
    </div>
  )
}
