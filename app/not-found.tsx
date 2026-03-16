import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-4 py-16">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link href="/note" className="text-primary hover:underline">
        Go to NOTE stage
      </Link>
    </div>
  )
}
