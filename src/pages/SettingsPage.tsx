import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

// ── Tab type ───────────────────────────────────────────────────────────────
type Tab = 'profile' | 'security' | 'danger'

// ── Eye icon toggle helper ─────────────────────────────────────────────────
function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
      <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clipRule="evenodd" />
    </svg>
  )
}

// ── Password input with show/hide toggle ───────────────────────────────────
function PasswordInput({
  id, label, value, onChange, disabled, autoComplete, placeholder,
}: {
  id: string; label: string; value: string
  onChange: (v: string) => void; disabled: boolean
  autoComplete?: string; placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-secondary">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? '••••••••'}
          className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-border bg-surface-raised
            text-sm text-primary placeholder:text-muted
            focus:outline-none focus:border-magenta focus:ring-1 focus:ring-magenta/30
            disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          <EyeIcon visible={show} />
        </button>
      </div>
    </div>
  )
}

// ── Field input helper ─────────────────────────────────────────────────────
function Field({
  id, label, type = 'text', value, onChange, disabled, placeholder, autoComplete,
}: {
  id: string; label: string; type?: string; value: string
  onChange: (v: string) => void; disabled: boolean
  placeholder?: string; autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-secondary">{label}</label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface-raised
          text-sm text-primary placeholder:text-muted
          focus:outline-none focus:border-magenta focus:ring-1 focus:ring-magenta/30
          disabled:opacity-50"
      />
    </div>
  )
}

// ── Spinner ────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

// ── Profile Tab ────────────────────────────────────────────────────────────
function ProfileTab() {
  const { user, updateProfile } = useAuth()
  const { showToast } = useToast()

  const [name,  setName]  = useState(user?.name  ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [busy,  setBusy]  = useState(false)

  const isDirty = name !== user?.name || email !== user?.email

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isDirty) return
    setBusy(true)
    try {
      const payload: Record<string, string> = {}
      if (name  !== user?.name)  payload.name  = name.trim()
      if (email !== user?.email) payload.email = email.trim()

      const res = await axios.patch<{ user_id: string; name: string; email: string; created_at: string }>(
        '/api/auth/profile', payload,
      )
      updateProfile({ name: res.data.name, email: res.data.email })
      showToast('Profile updated successfully.', 'success')
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.detail
        ? String(err.response.data.detail)
        : 'Failed to update profile.'
      showToast(msg, 'error')
    } finally {
      setBusy(false)
    }
  }

  const initial = (user?.name ?? '?').charAt(0).toUpperCase()

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Avatar preview */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-magenta text-white text-2xl font-bold
          flex items-center justify-center shadow-glow-sm shrink-0 select-none">
          {initial}
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{user?.name}</p>
          <p className="text-xs text-muted mt-0.5">{user?.email}</p>
          <p className="text-xs text-muted mt-1">
            Member since {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : '—'}
          </p>
        </div>
      </div>

      <hr className="border-border" />

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <Field
          id="settings-name"
          label="Display Name"
          value={name}
          onChange={setName}
          disabled={busy}
          placeholder="Your name"
          autoComplete="name"
        />
        <Field
          id="settings-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          disabled={busy}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div className="flex justify-end">
        <button
          id="settings-save-profile"
          type="submit"
          disabled={busy || !isDirty || !name.trim() || !email.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg
            bg-magenta hover:bg-magenta-hover text-white font-semibold text-sm
            transition-all active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {busy && <Spinner />}
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

// ── Security Tab ───────────────────────────────────────────────────────────
function SecurityTab() {
  const { showToast } = useToast()

  const [current, setCurrent]   = useState('')
  const [newPwd,   setNewPwd]   = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [busy,     setBusy]     = useState(false)

  const mismatch = confirm.length > 0 && newPwd !== confirm
  const canSubmit = current && newPwd.length >= 8 && newPwd === confirm && !busy

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setBusy(true)
    try {
      await axios.patch('/api/auth/password', {
        current_password: current,
        new_password:     newPwd,
      })
      setCurrent(''); setNewPwd(''); setConfirm('')
      showToast('Password changed. Please sign in again with your new password.', 'success')
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.detail
        ? String(err.response.data.detail)
        : 'Failed to change password.'
      showToast(msg, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Info banner */}
      <div className="flex gap-3 px-4 py-3 rounded-lg bg-surface-raised border border-border text-sm text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
          className="w-5 h-5 shrink-0 text-magenta mt-0.5" aria-hidden="true">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
        <span>After changing your password you'll need to sign in again on all devices.</span>
      </div>

      <div className="flex flex-col gap-4">
        <PasswordInput
          id="settings-current-pwd"
          label="Current Password"
          value={current}
          onChange={setCurrent}
          disabled={busy}
          autoComplete="current-password"
        />
        <PasswordInput
          id="settings-new-pwd"
          label="New Password"
          value={newPwd}
          onChange={setNewPwd}
          disabled={busy}
          autoComplete="new-password"
          placeholder="Min. 8 characters"
        />

        {/* Strength indicator */}
        {newPwd.length > 0 && (
          <div className="flex gap-1.5 items-center">
            {[4, 7, 11].map((threshold, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  newPwd.length > threshold
                    ? i === 0 ? 'bg-danger' : i === 1 ? 'bg-amber-400' : 'bg-emerald-500'
                    : 'bg-border'
                }`}
              />
            ))}
            <span className="text-xs text-muted ml-1">
              {newPwd.length <= 4 ? 'Weak' : newPwd.length <= 7 ? 'Fair' : newPwd.length <= 11 ? 'Good' : 'Strong'}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <PasswordInput
            id="settings-confirm-pwd"
            label="Confirm New Password"
            value={confirm}
            onChange={setConfirm}
            disabled={busy}
            autoComplete="new-password"
          />
          {mismatch && (
            <p className="text-xs text-danger">Passwords do not match.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          id="settings-change-password"
          type="submit"
          disabled={!canSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg
            bg-magenta hover:bg-magenta-hover text-white font-semibold text-sm
            transition-all active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {busy && <Spinner />}
          {busy ? 'Updating…' : 'Update password'}
        </button>
      </div>
    </form>
  )
}

// ── Danger Zone Tab ────────────────────────────────────────────────────────
function DangerTab() {
  const { logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [busy,     setBusy]     = useState(false)

  // User must type CONFIRM exactly to enable the button
  const CONFIRM_PHRASE = 'DELETE'
  const canDelete = password.length > 0 && confirm === CONFIRM_PHRASE && !busy

  async function handleDelete(e: FormEvent) {
    e.preventDefault()
    if (!canDelete) return
    setBusy(true)
    try {
      await axios.delete('/api/auth/account', { data: { password } })
      await logout()
      showToast('Your account has been permanently deleted.', 'success')
      navigate('/login', { replace: true })
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.detail
        ? String(err.response.data.detail)
        : 'Failed to delete account.'
      showToast(msg, 'error')
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleDelete} className="flex flex-col gap-6">

      {/* Warning banner */}
      <div className="flex gap-3 px-4 py-3 rounded-lg bg-danger/5 border border-danger/20 text-sm text-danger">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
          className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="font-semibold">This action is permanent and cannot be undone.</p>
          <p className="mt-0.5 text-danger/80">All your images, history, and data will be permanently deleted.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <PasswordInput
          id="settings-delete-password"
          label="Enter your password to confirm"
          value={password}
          onChange={setPassword}
          disabled={busy}
          autoComplete="current-password"
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="settings-delete-confirm" className="text-sm font-medium text-secondary">
            Type <span className="font-mono font-bold text-danger">{CONFIRM_PHRASE}</span> to confirm
          </label>
          <input
            id="settings-delete-confirm"
            type="text"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            disabled={busy}
            placeholder={CONFIRM_PHRASE}
            autoComplete="off"
            spellCheck={false}
            className="w-full px-3.5 py-2.5 rounded-lg border border-danger/30 bg-surface-raised
              text-sm text-primary placeholder:text-muted
              focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger/20
              disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          id="settings-delete-account"
          type="submit"
          disabled={!canDelete}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg
            bg-danger hover:bg-danger/90 text-white font-semibold text-sm
            transition-all active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {busy && <Spinner />}
          {busy ? 'Deleting…' : 'Permanently delete account'}
        </button>
      </div>
    </form>
  )
}

// ── Main Settings Page ─────────────────────────────────────────────────────
export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
        </svg>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 'danger',
      label: 'Danger Zone',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      ),
    },
  ]

  return (
    <main className="flex-1 py-10 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        {/* Page header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-primary tracking-tight">
            Account Settings
          </h1>
          <p className="text-secondary text-sm mt-1.5">
            Manage your profile, password and account preferences.
          </p>
        </div>

        {/* Tab bar + content card */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs.map(t => (
              <button
                key={t.id}
                id={`settings-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors
                  border-b-2 focus:outline-none whitespace-nowrap
                  ${tab === t.id
                    ? 'border-magenta text-magenta'
                    : 'border-transparent text-secondary hover:text-primary hover:border-border-strong'
                  }
                  ${t.id === 'danger' && tab !== 'danger' ? 'hover:text-danger hover:border-danger/30' : ''}
                  ${t.id === 'danger' && tab === 'danger'  ? 'border-danger text-danger' : ''}
                `}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6 sm:p-8">
            {tab === 'profile'  && <ProfileTab />}
            {tab === 'security' && <SecurityTab />}
            {tab === 'danger'   && <DangerTab />}
          </div>
        </div>

      </div>
    </main>
  )
}
