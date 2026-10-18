import { useDispatch, useSelector } from "react-redux";
import { Section } from "../../components/ui/section";
import { setPreference } from "../../features/settings/settingsSlice";

function ToggleRow({ id, label, description, checked, onChange }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <label htmlFor={id} className="text-[13px] font-medium text-(--d-text)">
          {label}
        </label>
        <p className="text-[12px] text-(--d-muted)">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`d-focus relative inline-flex h-4 w-7 shrink-0 items-center rounded-full border transition-colors ${
          checked
            ? "border-white bg-white"
            : "border-(--d-line-strong) bg-white/4"
        }`}
      >
        <span
          aria-hidden="true"
          className={`ml-0.5 inline-block h-3 w-3 rounded-full transition-transform ${
            checked
              ? "translate-x-3 bg-(--d-invert)"
              : "translate-x-0 bg-(--d-subtle)"
          }`}
        />
      </button>
    </li>
  );
}

export function Settings() {
  const dispatch = useDispatch();
  const preferences = useSelector((state) => state.settings.preferences);

  function updatePreference(key, value) {
    dispatch(setPreference({ key, value }));
  }

  return (
    <div className="flex flex-col gap-6">
      <Section title="Notifications">
        <div className="flex flex-col gap-2">
          <ul className="divide-y divide-(--d-line) border-y border-(--d-line)">
            <ToggleRow
              id="pref-reminders"
              label="Event reminders"
              description="A reminder 3 days before an event you are attending."
              checked={preferences.eventReminders}
              onChange={(value) => updatePreference("eventReminders", value)}
            />
            <ToggleRow
              id="pref-registration"
              label="Registration updates"
              description="Approvals, cancellations and ticket changes."
              checked={preferences.registrationUpdates}
              onChange={(value) =>
                updatePreference("registrationUpdates", value)
              }
            />
            <ToggleRow
              id="pref-nearby"
              label="Nearby events"
              description="Occasional suggestions for events in your city."
              checked={preferences.nearbyEvents}
              onChange={(value) => updatePreference("nearbyEvents", value)}
            />
            <ToggleRow
              id="pref-product"
              label="Product news"
              description="Feature announcements and tips from the team."
              checked={preferences.productNews}
              onChange={(value) => updatePreference("productNews", value)}
            />
          </ul>
        </div>
      </Section>
    </div>
  );
}
