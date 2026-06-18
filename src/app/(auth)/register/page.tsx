import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  return (
    <div className="container flex min-h-[calc(100vh-16rem)] py-12 md:py-24 flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        <div className="grid gap-6">
          <form>
            <div className="grid gap-4">
               <div className="grid gap-1">
                <label className="sr-only" htmlFor="name">Full Name</label>
                <input id="name" placeholder="John Doe" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              </div>
              <div className="grid gap-1">
                <label className="sr-only" htmlFor="email">Email</label>
                <input id="email" placeholder="name@example.com" type="email" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              </div>
              <div className="grid gap-1">
                <label className="sr-only" htmlFor="password">Password</label>
                <input id="password" placeholder="••••••••" type="password" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
              </div>
              <Button>Create Account</Button>
            </div>
          </form>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-brand underline underline-offset-4">
            Already have an account? Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
