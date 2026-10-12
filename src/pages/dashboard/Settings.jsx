import { useState } from 'react'
import { Badge } from '../../components/ui/badge'
import { Section } from '../../components/ui/section'

function ToggleRow({ id, label, description, checked, onChange }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <label htmlFor={id} className="text-[13px] font-medium text-[var(--d-text)]">
          {label}
        </label>
        <p className="text-[12px] text-[var(--d-muted)]">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`d-focus relative inline-flex h-4 w-7 shrink-0 items-center rounded-full border transition-colors ${
          checked ? 'border-white bg-white' : 'border-[var(--d-line-strong)] bg-white/[0.04]'
        }`}
      >
        <span
          aria-hidden="true"
          className={`ml-0.5 inline-block h-3 w-3 rounded-full transition-transform ${
            checked ? 'translate-x-3 bg-[var(--d-invert)]' : 'translate-x-0 bg-[var(--d-subtle)]'
          }`}
        />
      </button>
    </li>
  )
}

function InfoRow({ label, value, tone = 'neutral' }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <span className="text-[13px] text-[var(--d-muted)]">{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </li>
  )
}

export function Settings() {
  const [preferences, setPreferences] = useState({
    eventReminders: true,
    registrationUpdates: true,
    nearbyEvents: false,
    productNews: false,
  })

  function updatePreference(key, value) {
    setPreferences((previous) => ({ ...previous, [key]: value }))
  }

  return (
    <div className="flex flex-col gap-6">
      <Section title="Notifications" description="Choose what EventHub tells you about">
        <div className="flex flex-col gap-2">
          <ul className="divide-y divide-[var(--d-line)] border-y border-[var(--d-line)]">
            <ToggleRow
              id="pref-reminders"
              label="Event reminders"
              description="A reminder 3 days before an event you are attending."
              checked={preferences.eventReminders}
              onChange={(value) => updatePreference('eventReminders', value)}
            />
            <ToggleRow
              id="pref-registration"
              label="Registration updates"
              description="Approvals, cancellations and ticket changes."
              checked={preferences.registrationUpdates}
              onChange={(value) => updatePreference('registrationUpdates', value)}
            />
            <ToggleRow
              id="pref-nearby"
              label="Nearby events"
              description="Occasional suggestions for events in your city."
              checked={preferences.nearbyEvents}
              onChange={(value) => updatePreference('nearbyEvents', value)}
            />
            <ToggleRow
              id="pref-product"
              label="Product news"
              description="Feature announcements and tips from the team."
              checked={preferences.productNews}
              onChange={(value) => updatePreference('productNews', value)}
            />
          </ul>
          <p className="text-[11.5px] text-[var(--d-subtle)]">
            Preferences are stored locally for this demo — no notification service is connected yet.
          </p>
        </div>
      </Section>

      <Section title="Appearance">
        <p className="text-[13px] text-[var(--d-muted)]">
          The dashboard uses a dark theme unconditionally.
        </p>
      </Section>

      <Section title="Account">
        <div className="flex flex-col gap-2">
          <ul className="divide-y divide-[var(--d-line)] border-y border-[var(--d-line)]">
            <InfoRow label="Authentication" value="Not wired" tone="warn" />
            <InfoRow label="Email digest" value="Weekly" />
            <InfoRow label="Time zone" value="System default" />
          </ul>
          <p className="text-[11.5px] text-[var(--d-subtle)]">
            Password and session settings become available once the auth feature is integrated.
          </p>
        </div>
      </Section>
    </div>
  )
}
