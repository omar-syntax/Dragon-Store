'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setIsLoading(true)
    try {
      const result = await register(form.name, form.email, form.password, form.phone)
      if (result.error) setError(result.error)
      else router.push('/account')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <div className="container flex min-h-[calc(100vh-16rem)] py-12 md:py-24 flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Join Dragon and start shopping</p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm space-y-5">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <input id="name" type="text" value={form.name} onChange={update('name')} placeholder="John Doe" required className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="text-sm font-medium">Email</label>
              <input id="reg-email" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium">Phone <span className="text-muted-foreground">(optional)</span></label>
              <input id="phone" type="tel" value={form.phone} onChange={update('phone')} placeholder="+1 555 000 0000" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="text-sm font-medium">Password</label>
              <div className="relative">
                <input id="reg-password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="Min. 6 characters" required className={inputClass + ' pr-10'} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirm" className="text-sm font-medium">Confirm Password</label>
              <input id="confirm" type="password" value={form.confirm} onChange={update('confirm')} placeholder="••••••••" required className={inputClass} />
            </div>

            <Button type="submit" className="w-full gap-2 mt-2" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Creating account…</span>
              ) : (
                <><UserPlus className="h-4 w-4" /> Create Account</>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
